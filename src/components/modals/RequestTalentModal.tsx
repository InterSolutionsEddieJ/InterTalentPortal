'use client';

// Created to Request Talent if no candidates are available on 12/12/25 MS 
import { useState } from 'react';

interface RequestTalentModalProps {
  onClose: () => void;
}

export default function RequestTalentModal({ onClose }: RequestTalentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/request-talent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-gray-900 placeholder-gray-500 mb-4">Request Talent</h2>
        <p className="text-gray-600 mb-6">
          At the moment, all available talent is engaged with other properties.
  Please let us know your staffing needs, and an InterSolutions representative will follow up shortly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            className="w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <input
            required
            type="email"
            className="w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            className="w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <textarea
            required
            rows={4}
            className="w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500"
            placeholder="Tell us what type of talent you need..."
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />

          {status === 'success' && (
            <p className="text-green-600 font-semibold">Request sent!</p>
          )}

          {status === 'error' && (
            <p className="text-red-600 font-semibold">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isSubmitting ? 'Sending…' : 'Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
