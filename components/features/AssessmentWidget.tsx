'use client';

import { useState } from 'react';
import type { AssessmentResult } from '@/lib/types/setup';

interface Props {
  assessment: AssessmentResult | null;
  manualOverride: number | null;
  onOverrideChange: (level: number | null) => void;
}

export function AssessmentWidget({ assessment, manualOverride, onOverrideChange }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  if (!assessment) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <p className="text-sm text-gray-400">
          Fill in project details above to see complexity assessment
        </p>
      </div>
    );
  }

  const effectiveLevel = manualOverride !== null ? manualOverride : assessment.level;
  const isOverridden = manualOverride !== null;

  // Level colors
  const levelColors = {
    0: 'bg-gray-700 text-gray-200 border-gray-600',
    1: 'bg-green-900 text-green-200 border-green-700',
    2: 'bg-blue-900 text-blue-200 border-blue-700',
    3: 'bg-yellow-900 text-yellow-200 border-yellow-700',
    4: 'bg-red-900 text-red-200 border-red-700',
  };

  const levelNames = ['Minimal', 'Basic', 'Standard', 'Comprehensive', 'Enterprise'];

  return (
    <div className="space-y-4 rounded-lg border border-blue-700 bg-blue-950 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Recommended Planning Level</h3>
          <p className="mt-1 text-sm text-gray-400">Based on your project characteristics</p>
        </div>
        {isOverridden && (
          <span className="rounded-full bg-orange-900 px-3 py-1 text-xs font-medium text-orange-200">
            Manual Override
          </span>
        )}
      </div>

      {/* Level Badge */}
      <div className="flex items-center gap-4">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-lg border-2 ${levelColors[effectiveLevel as keyof typeof levelColors]}`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold">L{effectiveLevel}</div>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold text-white">{levelNames[effectiveLevel]}</div>
          <div className="mt-1 text-sm text-gray-400">
            Score: {assessment.totalScore}/40 points (
            {Math.round((assessment.totalScore / 40) * 100)}%)
          </div>
          <div className="mt-2">
            <div className="h-2 w-full rounded-full bg-gray-700">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${(assessment.totalScore / 40) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Manual Override Dropdown */}
      <div>
        <label htmlFor="levelOverride" className="block text-sm font-medium text-gray-300">
          Planning Level Selection
        </label>
        <select
          id="levelOverride"
          value={manualOverride !== null ? manualOverride : ''}
          onChange={(e) => {
            const value = e.target.value;
            onOverrideChange(value === '' ? null : Number(value));
          }}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">
            Use recommended (Level {assessment.level} - {levelNames[assessment.level]})
          </option>
          <option value="0">Level 0 - Minimal (Simple projects)</option>
          <option value="1">Level 1 - Basic (Small teams)</option>
          <option value="2">Level 2 - Standard (Medium projects)</option>
          <option value="3">Level 3 - Comprehensive (Large projects)</option>
          <option value="4">Level 4 - Enterprise (Mission-critical)</option>
        </select>
        <p className="mt-1 text-sm text-gray-400">
          {isOverridden
            ? `You've selected ${levelNames[effectiveLevel]} instead of the recommended ${levelNames[assessment.level]}`
            : 'Using recommended level based on assessment'}
        </p>
      </div>

      {/* Criteria Breakdown Summary */}
      {showDetails && (
        <div className="mt-4 space-y-2 rounded-md border border-gray-700 bg-gray-900 p-4">
          <h4 className="text-sm font-semibold text-white">Criteria Breakdown</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Project Size:</span>
              <span className="font-medium text-white">{assessment.breakdown.projectSize}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Team Size:</span>
              <span className="font-medium text-white">{assessment.breakdown.teamSize}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Complexity:</span>
              <span className="font-medium text-white">
                {assessment.breakdown.codebaseComplexity}/5
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Integrations:</span>
              <span className="font-medium text-white">{assessment.breakdown.integrations}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">User Base:</span>
              <span className="font-medium text-white">{assessment.breakdown.userBase}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Security:</span>
              <span className="font-medium text-white">{assessment.breakdown.security}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duration:</span>
              <span className="font-medium text-white">{assessment.breakdown.duration}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Existing Code:</span>
              <span className="font-medium text-white">{assessment.breakdown.existingCode}/5</span>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Details Button */}
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm font-medium text-blue-400 hover:text-blue-300"
      >
        {showDetails ? '▼ Hide' : '▶ Show'} Assessment Details
      </button>
    </div>
  );
}
