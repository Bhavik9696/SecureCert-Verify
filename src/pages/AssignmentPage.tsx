import React, { useState } from 'react';
import { useVerification } from '../context/VerificationContext.js';
import { Modal } from '../components/common/Modal.js';
import { BookOpenCheck, Plus, Calendar, Building2, CheckCircle2, ShieldAlert, AlertTriangle, FolderUp } from 'lucide-react';
import { NavTab } from '../components/layout/Sidebar.js';

interface AssignmentPageProps {
  setActiveTab: (tab: NavTab) => void;
}

export const AssignmentPage: React.FC<AssignmentPageProps> = ({ setActiveTab }) => {
  const { assignments, createAssignment, setSelectedAssignmentId } = useVerification();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [courseName, setCourseName] = useState<string>('');
  const [semester, setSemester] = useState<string>('Semester 5');
  const [department, setDepartment] = useState<string>('Computer Science & Engineering');
  const [deadline, setDeadline] = useState<string>(
    new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !courseName) return;
    setIsSubmitting(true);
    try {
      await createAssignment({
        name,
        courseName,
        semester,
        department,
        deadline,
        description,
      });
      setIsModalOpen(false);
      setName('');
      setCourseName('');
      setDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadForAssignment = (asgId: string) => {
    setSelectedAssignmentId(asgId);
    setActiveTab('upload');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpenCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Course Certificate Assignments</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage course certification submission tasks for your department students.
          </p>
        </div>

        <button
          id="create-assignment-btn"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Assignment</span>
        </button>
      </div>

      {/* Assignment Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.map((asg) => (
          <div
            key={asg.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 inline-block mb-1">
                    {asg.semester} • {asg.department}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {asg.name}
                  </h3>
                </div>
              </div>

              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Course: {asg.courseName}
              </p>

              {asg.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {asg.description}
                </p>
              )}
            </div>

            {/* Stats row */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
              <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                <div className="text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{asg.verifiedCount}</span>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Verified</div>
              </div>

              <div className="bg-red-50/60 dark:bg-red-950/30 p-2 rounded-xl border border-red-100 dark:border-red-900/40">
                <div className="text-xs text-red-700 dark:text-red-300 font-bold flex items-center justify-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{asg.fakeCount}</span>
                </div>
                <div className="text-[10px] text-red-600 dark:text-red-400 font-medium">Fake</div>
              </div>

              <div className="bg-amber-50/60 dark:bg-amber-950/30 p-2 rounded-xl border border-amber-100 dark:border-amber-900/40">
                <div className="text-xs text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{asg.manualReviewCount}</span>
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Review</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Deadline: {asg.deadline}</span>
              </span>

              <button
                onClick={() => handleUploadForAssignment(asg.id)}
                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-semibold rounded-lg border border-blue-200 dark:border-blue-800 transition-colors flex items-center gap-1"
              >
                <FolderUp className="w-3.5 h-3.5" />
                <span>Upload Batch</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assignment Modal */}
      <Modal
        id="create-assignment-modal"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Course Assignment"
        subtitle="Specify assignment parameters for student certificate submissions"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Assignment Name
            </label>
            <input
              id="asg-name-input"
              type="text"
              required
              placeholder="e.g. NPTEL Data Structures Certification 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Course Name
            </label>
            <input
              id="asg-course-input"
              type="text"
              required
              placeholder="e.g. Data Structures and Algorithms in Java"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Semester
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="Semester 5"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Deadline Date
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Computer Science & Engineering"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Description / Guidelines
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed instructions for student certificate submissions..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
            >
              Create Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
