import { useState } from 'react';
import { sendFcmBroadcast } from '../../services/api';

const roles = [
  { label: 'All Users', value: 'all' },
  { label: 'Admins', value: 'admin' },
  { label: 'Employees', value: 'employee' },
  // Add more roles as needed
];

const AdminFcmBroadcast = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('all');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await sendFcmBroadcast({ title, body, target });
      setSuccess('Broadcast sent successfully!');
      setTitle('');
      setBody('');
    } catch (err: any) {
      setError(err?.message || 'Failed to send broadcast.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Send FCM Broadcast</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            maxLength={100}
          />
        </div>
        <div>
          <label className="block font-medium">Body</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={body}
            onChange={e => setBody(e.target.value)}
            required
            maxLength={500}
          />
        </div>
        <div>
          <label className="block font-medium">Target</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={target}
            onChange={e => setTarget(e.target.value)}
          >
            {roles.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() => setPreview(!preview)}
          >
            {preview ? 'Hide Preview' : 'Preview'}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Broadcast'}
          </button>
        </div>
        {success && <div className="text-green-600">{success}</div>}
        {error && <div className="text-red-600">{error}</div>}
      </form>
      {preview && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <div className="font-bold">Preview:</div>
          <div className="text-lg">{title}</div>
          <div>{body}</div>
          <div className="text-sm text-gray-500 mt-2">Target: {roles.find(r => r.value === target)?.label}</div>
        </div>
      )}
    </div>
  );
};

export default AdminFcmBroadcast;
