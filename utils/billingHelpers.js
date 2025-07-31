// Billing calculation helpers
export function calculateEarnings(employeeId, periodStart, periodEnd) {
  // Load work reports, projects, and leave for the employee
  const reports = (JSON.parse(localStorage.getItem('journalEntries') || '[]')).filter(r => r.employeeId === employeeId && r.date >= periodStart && r.date <= periodEnd);
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const leaves = (JSON.parse(localStorage.getItem('leaveRequests') || '[]')).filter(l => l.userId === employeeId && l.status === 'approved' && l.startDate <= periodEnd && l.endDate >= periodStart);

  let basePay = 0, overtime = 0, bonuses = 0, penalties = 0, total = 0;
  const breakdown = [];

  for (const report of reports) {
    for (const log of report.projectLogs || []) {
      const project = projects.find(p => p.id === log.projectId);
      if (!project) continue;
      let subtotal = 0, units = '', rate = '';
      if (project.billingType === 'hourly') {
        subtotal = (log.hoursSpent || 0) * (project.ratePerHour || 0);
        units = `${log.hoursSpent || 0} hrs`;
        rate = `$${project.ratePerHour}/hr`;
        basePay += subtotal;
      } else if (project.billingType === 'count_based') {
        subtotal = (log.achievedCount || 0) * (project.countMultiplier || 0);
        units = `${log.achievedCount || 0} ${project.countMetricLabel || ''}`;
        rate = `$${project.countMultiplier}/${project.countMetricLabel || 'unit'}`;
        bonuses += subtotal;
      } else if (project.billingType === 'fixed') {
        subtotal = project.flatAmount || 0;
        units = 'flat';
        rate = `$${project.flatAmount}`;
        basePay += subtotal;
      } else if (project.billingType === 'hybrid') {
        // Example: hybrid logic, can be extended
        subtotal = ((log.hoursSpent || 0) * (project.ratePerHour || 0)) + ((log.achievedCount || 0) * (project.countMultiplier || 0));
        units = `${log.hoursSpent || 0} hrs + ${log.achievedCount || 0} ${project.countMetricLabel || ''}`;
        rate = `hybrid`;
        basePay += (log.hoursSpent || 0) * (project.ratePerHour || 0);
        bonuses += (log.achievedCount || 0) * (project.countMultiplier || 0);
      }
      breakdown.push({ name: project.name, type: project.billingType, units, rate, subtotal });
    }
  }

  // Penalties, overtime, etc. can be added here
  total = basePay + overtime + bonuses - penalties;
  return { basePay, overtime, bonuses, penalties, total, breakdown };
}
