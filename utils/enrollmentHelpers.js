// Enrollment helpers for training sessions
export function saveEnrollment(enrollment) {
  const enrollments = getEnrollments();
  enrollments.push(enrollment);
  localStorage.setItem('enrollments', JSON.stringify(enrollments));
}

export function getEnrollments() {
  const raw = localStorage.getItem('enrollments');
  return raw ? JSON.parse(raw) : [];
}

export function createEnrollment({ sessionId, employeeId }) {
  return {
    id: Date.now(),
    sessionId,
    employeeId,
    status: 'requested',
    requestedAt: Date.now(),
  };
}
