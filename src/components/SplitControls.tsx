
"use client";

import { Clock } from "lucide-react";

type Props = {
  duration: number;
  onChange: (value: number) => void;
};

const presets = [15, 30, 45, 60];

export default function SplitControls({ duration, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-5 flex items-center gap-2">
        <Clock className="text-blue-600" size={21} />
        <h3 className="font-bold text-gray-900">Split duration</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {presets.map((seconds) => (
          <button
            key={seconds}
            onClick={() => onChange(seconds)}
            className={`rounded-xl border p-4 font-semibold transition ${duration === seconds
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
          >
            {seconds} sec
          </button>
        ))}
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Custom duration (seconds)
        </label>
        <input
          type="number"
          min="1"
          max="3600"
          value={duration}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (Number.isInteger(value) && value >= 1 && value <= 3600) {
              onChange(value);
            }
          }}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Choose how long each output video clip should be.
      </p>
    </section>
  );
}
