import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  UserPlus,
  Pencil,
  Trash2,
  KeyRound,
  Check,
  AlertCircle,
  Users,
  Phone,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  UserCheck
} from 'lucide-react';
import { AdminUser } from '../types';
import { AUTHORIZED_STAFF } from '../data/initialData';

interface AdminUsersManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminUsers: AdminUser[];
  setAdminUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  currentAdmin: AdminUser | null;
  setCurrentAdmin: (admin: AdminUser | null) => void;
}

export default function AdminUsersManagementModal({
  isOpen,
  onClose,
  adminUsers,
  setAdminUsers,
  currentAdmin,
  setCurrentAdmin
}: AdminUsersManagementModalProps) {
  const [activeView, setActiveView] = useState<'list' | 'add' | 'edit' | 'pin'>('list');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Global pin visibility toggles for list
  const [visiblePins, setVisiblePins] = useState<Record<string, boolean>>({});

  // Add Admin State
  const [newName, setNewName] = useState<string>('');
  const [newRole, setNewRole] = useState<'headmaster' | 'asst_headmaster' | 'clerk' | 'accounts' | 'it_admin'>('clerk');
  const [newRoleName, setNewRoleName] = useState<string>('অফিস সহকারী ও প্রধান ক্লার্ক');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newBadge, setNewBadge] = useState<string>('শিক্ষার্থী ভর্তি ও ব্যাংক রসিদ এন্ট্রি');
  const [newPin, setNewPin] = useState<string>('1234');
  const [showNewPin, setShowNewPin] = useState<boolean>(false);

  // Edit Admin State
  const [editingAdminId, setEditingAdminId] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editRole, setEditRole] = useState<'headmaster' | 'asst_headmaster' | 'clerk' | 'accounts' | 'it_admin'>('clerk');
  const [editRoleName, setEditRoleName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editBadge, setEditBadge] = useState<string>('');
  const [editPin, setEditPin] = useState<string>('1234');
  const [showEditPin, setShowEditPin] = useState<boolean>(false);

  // Change PIN State
  const [pinTargetAdminId, setPinTargetAdminId] = useState<string>('all');
  const [currentPinInput, setCurrentPinInput] = useState<string>('');
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [confirmPinInput, setConfirmPinInput] = useState<string>('');
  const [showPinInputs, setShowPinInputs] = useState<boolean>(false);

  if (!isOpen) return null;

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4500);
  };

  const togglePinVisibility = (id: string) => {
    setVisiblePins(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRoleChangeForAdd = (role: 'headmaster' | 'asst_headmaster' | 'clerk' | 'accounts' | 'it_admin') => {
    setNewRole(role);
    switch (role) {
      case 'headmaster':
        setNewRoleName('প্রধান শিক্ষক');
        setNewBadge('সর্বোচ্চ প্রশাসনিক অথরাইজেশন');
        break;
      case 'asst_headmaster':
        setNewRoleName('সহকারী প্রধান শিক্ষক');
        setNewBadge('শিক্ষা ও প্রশাসনিক কার্যক্রম সমন্বয়');
        break;
      case 'clerk':
        setNewRoleName('অফিস সহকারী ও প্রধান ক্লার্ক');
        setNewBadge('শিক্ষার্থী ভর্তি ও ব্যাংক রসিদ এন্ট্রি');
        break;
      case 'accounts':
        setNewRoleName('হিসাবরক্ষক (Accounts)');
        setNewBadge('ব্যাংক হিসাব ও আয়-ব্যয় ভাউচার');
        break;
      case 'it_admin':
        setNewRoleName('আইটি অ্যাডমিন ও সিস্টেম ইনচার্জ');
        setNewBadge('সিস্টেম মেইনটেন্যান্স ও ডাটা সিঙ্ক');
        break;
    }
  };

  // 1. ADD NEW ADMIN
  const handleAddNewAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showFeedback('error', 'এডমিনের নাম প্রদান আবশ্যক!');
      return;
    }
    if (!newPin.trim()) {
      showFeedback('error', 'লগইন পাসওয়ার্ড / পিন প্রদান আবশ্যক!');
      return;
    }
    if (newPin.trim().length < 4) {
      showFeedback('error', 'পাসওয়ার্ড / পিন কমপক্ষে ৪ সংখ্যার হতে হবে!');
      return;
    }

    const nextIdNum = adminUsers.length + 1;
    const generatedId = `ADM-${String(nextIdNum).padStart(2, '0')}`;

    const newAdmin: AdminUser = {
      id: generatedId,
      name: newName.trim(),
      role: newRole,
      roleName: newRoleName.trim() || 'প্রশাসনিক কর্মকর্তা',
      phone: newPhone.trim() || '01800-000000',
      badge: newBadge.trim() || 'প্রশাসনিক দায়িত্ব পালন',
      pin: newPin.trim()
    };

    const updated = [...adminUsers, newAdmin];
    setAdminUsers(updated);
    try {
      localStorage.setItem('nsh_admin_users', JSON.stringify(updated));
    } catch {}

    setNewName('');
    setNewPhone('');
    setNewPin('1234');
    setActiveView('list');
    showFeedback('success', `নতুন এডমিন "${newAdmin.name}" (${newAdmin.roleName}) সফলভাবে যুক্ত করা হয়েছে!`);
  };

  // 2. START EDIT ADMIN
  const handleStartEdit = (admin: AdminUser) => {
    setEditingAdminId(admin.id);
    setEditName(admin.name);
    setEditRole(admin.role);
    setEditRoleName(admin.roleName);
    setEditPhone(admin.phone);
    setEditBadge(admin.badge);
    setEditPin(admin.pin || '1234');
    setShowEditPin(false);
    setActiveView('edit');
  };

  // 3. SAVE EDIT ADMIN
  const handleSaveEditAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showFeedback('error', 'এডমিনের নাম প্রদান আবশ্যক!');
      return;
    }
    if (!editPin.trim() || editPin.trim().length < 4) {
      showFeedback('error', 'পাসওয়ার্ড / পিন কমপক্ষে ৪ সংখ্যার হতে হবে!');
      return;
    }

    const updated = adminUsers.map(a => {
      if (a.id === editingAdminId) {
        return {
          ...a,
          name: editName.trim(),
          role: editRole,
          roleName: editRoleName.trim() || a.roleName,
          phone: editPhone.trim() || a.phone,
          badge: editBadge.trim() || a.badge,
          pin: editPin.trim()
        };
      }
      return a;
    });

    setAdminUsers(updated);
    try {
      localStorage.setItem('nsh_admin_users', JSON.stringify(updated));
    } catch {}

    // If current admin was edited, update session too
    if (currentAdmin && currentAdmin.id === editingAdminId) {
      const updatedCurrent = updated.find(a => a.id === editingAdminId);
      if (updatedCurrent) {
        setCurrentAdmin(updatedCurrent);
        try {
          sessionStorage.setItem('nsh_admin_session', JSON.stringify(updatedCurrent));
        } catch {}
      }
    }

    setActiveView('list');
    showFeedback('success', 'এডমিন তথ্য ও পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!');
  };

  // 4. DELETE ADMIN
  const handleDeleteAdmin = (admin: AdminUser) => {
    if (adminUsers.length <= 1) {
      showFeedback('error', 'সতর্কতা: সিস্টেমে কমপক্ষে ১ জন এডমিন থাকতে হবে! এটি মুছে ফেলা যাবে না।');
      return;
    }

    if (confirm(`আপনি কি নিশ্চিত যে "${admin.name}" (${admin.roleName})-কে এডমিন তালিকা থেকে মুছে ফেলতে চান?`)) {
      const updated = adminUsers.filter(a => a.id !== admin.id);
      setAdminUsers(updated);
      try {
        localStorage.setItem('nsh_admin_users', JSON.stringify(updated));
      } catch {}

      // If logged in as the deleted admin, switch to first available admin
      if (currentAdmin && currentAdmin.id === admin.id) {
        const nextAdmin = updated[0] || null;
        setCurrentAdmin(nextAdmin);
        try {
          if (nextAdmin) {
            sessionStorage.setItem('nsh_admin_session', JSON.stringify(nextAdmin));
          } else {
            sessionStorage.removeItem('nsh_admin_session');
          }
        } catch {}
      }

      showFeedback('success', `এডমিন "${admin.name}"-কে অপসারণ করা হয়েছে।`);
    }
  };

  // 5. CHANGE PIN / PASSWORD
  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCurrent = currentPinInput.trim();
    const enteredNew = newPinInput.trim();
    const enteredConfirm = confirmPinInput.trim();

    if (enteredNew.length < 4) {
      showFeedback('error', 'নতুন পাসওয়ার্ড / পিন কোড কমপক্ষে ৪ ডিজিট বা অক্ষরের হতে হবে!');
      return;
    }
    if (enteredNew !== enteredConfirm) {
      showFeedback('error', 'নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মিলছে না!');
      return;
    }

    if (pinTargetAdminId === 'all') {
      // Master PIN & all admins
      const masterPin = localStorage.getItem('nsh_admin_pin') || '1234';
      if (enteredCurrent !== masterPin) {
        showFeedback('error', 'বর্তমান মাস্টার পিন কোড সঠিক নয়!');
        return;
      }

      localStorage.setItem('nsh_admin_pin', enteredNew);
      const updated = adminUsers.map(a => ({ ...a, pin: enteredNew }));
      setAdminUsers(updated);
      try {
        localStorage.setItem('nsh_admin_users', JSON.stringify(updated));
      } catch {}

      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setActiveView('list');
      showFeedback('success', 'সকল এডমিনের মাস্টার লগইন পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
    } else {
      // Specific admin
      const target = adminUsers.find(a => a.id === pinTargetAdminId);
      if (!target) {
        showFeedback('error', 'নির্দিষ্ট এডমিন খুঁজে পাওয়া যায়নি!');
        return;
      }

      const expectedCurrent = target.pin || localStorage.getItem('nsh_admin_pin') || '1234';
      if (enteredCurrent !== expectedCurrent) {
        showFeedback('error', `নির্বাচিত কর্মকর্তা "${target.name}"-এর বর্তমান পাসওয়ার্ড সঠিক নয়!`);
        return;
      }

      const updated = adminUsers.map(a => {
        if (a.id === pinTargetAdminId) {
          return { ...a, pin: enteredNew };
        }
        return a;
      });

      setAdminUsers(updated);
      try {
        localStorage.setItem('nsh_admin_users', JSON.stringify(updated));
      } catch {}

      if (currentAdmin && currentAdmin.id === pinTargetAdminId) {
        const updatedCurrent = updated.find(a => a.id === pinTargetAdminId);
        if (updatedCurrent) {
          setCurrentAdmin(updatedCurrent);
          try {
            sessionStorage.setItem('nsh_admin_session', JSON.stringify(updatedCurrent));
          } catch {}
        }
      }

      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setActiveView('list');
      showFeedback('success', `"${target.name}"-এর পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!`);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('আপনি কি নিশ্চিত যে এডমিন তালিকা মূল ডিফল্ট ৫ জন কর্মকর্তাতে রিসেট করতে চান? (ডিফল্ট পাসওয়ার্ড: 1234)')) {
      const defaultUsers = AUTHORIZED_STAFF.map(u => ({ ...u, pin: '1234' }));
      setAdminUsers(defaultUsers);
      localStorage.setItem('nsh_admin_users', JSON.stringify(defaultUsers));
      localStorage.setItem('nsh_admin_pin', '1234');
      showFeedback('success', 'এডমিন তালিকা মূল ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে (ডিফল্ট পিন: 1234)।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative my-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-500/10 border border-amber-400/40 text-amber-700 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>এডমিন ইউজার ও সিকিউরিটি ব্যবস্থাপনা</span>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full hidden sm:inline-block">
                  কন্ট্রোল প্যানেল
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                এডমিন একাউন্ট যুক্ত, তথ্য এডিট, অপসারণ ও লগইন পাসওয়ার্ড / পিন পরিচালনা
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 border ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedbackMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveView('list')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeView === 'list'
                ? 'bg-[#0c3664] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>এডমিন তালিকা ({adminUsers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('add')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeView === 'add'
                ? 'bg-[#0c3664] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ নতুন এডমিন যোগ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('pin')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeView === 'pin'
                ? 'bg-[#0c3664] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>পাসওয়ার্ড / পিন পরিবর্তন</span>
          </button>
        </div>

        {/* VIEW 1: ADMIN LIST */}
        {activeView === 'list' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>অনুমোদিত কর্মকর্তার তালিকা (লগইনে শুধু সঠিক পাসওয়ার্ড দিয়ে প্রবেশ করা যাবে)</span>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-amber-700 hover:text-amber-900 flex items-center gap-1 underline text-[11px]"
                title="ডিফল্ট ৫ জন এডমিনে রিসেট"
              >
                <RefreshCw className="w-3 h-3" />
                <span>ডিফল্ট রিস্টোর</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {adminUsers.map((admin) => {
                const isCurrent = currentAdmin?.id === admin.id;
                const isPinVisible = !!visiblePins[admin.id];
                const currentAdminPin = admin.pin || '1234';

                return (
                  <div
                    key={admin.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/40'
                        : 'bg-slate-50/80 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                          {admin.id}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {admin.name}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            বর্তমান সেশন
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#0c3664] font-semibold mt-1">
                        {admin.roleName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {admin.phone}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-600 truncate max-w-xs">{admin.badge}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        {/* PIN preview badge with toggle */}
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-700">
                          <Lock className="w-2.5 h-2.5 text-amber-600" />
                          <span>পাসওয়ার্ড:</span>
                          <span className="font-bold text-slate-900">
                            {isPinVisible ? currentAdminPin : '••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePinVisibility(admin.id)}
                            className="text-slate-400 hover:text-slate-700 ml-0.5"
                            title={isPinVisible ? 'লুকান' : 'পাসওয়ার্ড দেখুন'}
                          >
                            {isPinVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(admin)}
                        className="px-2.5 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-300 rounded-xl transition-colors shadow-2xs flex items-center gap-1 text-xs font-bold"
                        title="তথ্য ও পাসওয়ার্ড এডিট করুন"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">এডিট</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAdmin(admin)}
                        disabled={adminUsers.length <= 1}
                        className={`p-2 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-300 rounded-xl transition-colors shadow-2xs ${
                          adminUsers.length <= 1 ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                        title={adminUsers.length <= 1 ? 'কমপক্ষে ১ জন এডমিন থাকতে হবে' : 'এডমিন মুছে ফেলুন'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 flex items-start gap-2 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>নিরাপত্তা সতর্কতা:</strong> কোনো সদস্যের পাসওয়ার্ড বা তথ্য পরিবর্তন বা নতুন এডমিন যুক্ত করা হলে তা সাথে সাথে কার্যকর হবে। লগইন করার সময় পাসওয়ার্ড অবশ্যই সঠিকভাবে মিলতে হবে।
              </span>
            </div>
          </div>
        )}

        {/* VIEW 2: ADD NEW ADMIN */}
        {activeView === 'add' && (
          <form onSubmit={handleAddNewAdmin} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">কর্মকর্তা / শিক্ষকের পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: জনাব মোঃ হারুনুর রশিদ"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">এডমিন ভূমিকা (Role) *</label>
                <select
                  value={newRole}
                  onChange={(e) => handleRoleChangeForAdd(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                >
                  <option value="headmaster">প্রধান শিক্ষক (Headmaster)</option>
                  <option value="asst_headmaster">সহকারী প্রধান শিক্ষক</option>
                  <option value="clerk">অফিস সহকারী ও ক্লার্ক</option>
                  <option value="accounts">হিসাবরক্ষক (Accounts)</option>
                  <option value="it_admin">আইটি এডমিন / সিস্টেম</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">পদবী নাম (প্রদর্শিত হবে) *</label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="যেমন: অফিস সহকারী"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="018XX-XXXXXX"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">লগইন পাসওয়ার্ড / পিন (কমপক্ষে ৪ সংখ্যা) *</label>
                <div className="relative">
                  <input
                    type={showNewPin ? 'text' : 'password'}
                    required
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন (যেমন: 1234)"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">দায়িত্ব / ব্যাজ বিবরণ *</label>
                <input
                  type="text"
                  required
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  placeholder="যেমন: শিক্ষার্থী ভর্তি ও ব্যাংক রসিদ এন্ট্রি"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>নতুন এডমিন যুক্ত করুন</span>
              </button>
            </div>
          </form>
        )}

        {/* VIEW 3: EDIT ADMIN */}
        {activeView === 'edit' && (
          <form onSubmit={handleSaveEditAdmin} className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-semibold flex items-center justify-between">
              <span>এডমিন আইডি: {editingAdminId} তথ্য ও পাসওয়ার্ড সম্পাদনা</span>
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="text-xs underline text-blue-700 font-bold"
              >
                তালিকায় ফিরুন
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">কর্মকর্তা / শিক্ষকের পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">এডমিন ভূমিকা (Role) *</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                >
                  <option value="headmaster">প্রধান শিক্ষক</option>
                  <option value="asst_headmaster">সহকারী প্রধান শিক্ষক</option>
                  <option value="clerk">অফিস সহকারী ও ক্লার্ক</option>
                  <option value="accounts">হিসাবরক্ষক (Accounts)</option>
                  <option value="it_admin">আইটি এডমিন / সিস্টেম</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">পদবী নাম *</label>
                <input
                  type="text"
                  required
                  value={editRoleName}
                  onChange={(e) => setEditRoleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">লগইন পাসওয়ার্ড / পিন (Password / PIN) *</label>
                <div className="relative">
                  <input
                    type={showEditPin ? 'text' : 'password'}
                    required
                    value={editPin}
                    onChange={(e) => setEditPin(e.target.value)}
                    placeholder="নতুন পাসওয়ার্ড বা পিন দিন"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPin(!showEditPin)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showEditPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">দায়িত্ব / ব্যাজ বিবরণ *</label>
                <input
                  type="text"
                  required
                  value={editBadge}
                  onChange={(e) => setEditBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0c3664] hover:bg-[#092b50] text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>পরিবর্তন সংরক্ষণ করুন</span>
              </button>
            </div>
          </form>
        )}

        {/* VIEW 4: CHANGE PIN */}
        {activeView === 'pin' && (
          <form onSubmit={handleSavePin} className="space-y-4 text-xs max-w-lg mx-auto">
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <KeyRound className="w-4 h-4 text-amber-700" />
                <span>লগইন পাসওয়ার্ড / পিন আপডেট</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                নির্দিষ্ট কর্মকর্তার পাসওয়ার্ড অথবা সকল কর্মকর্তার মাস্টার পিন পরিবর্তন করতে নিচের ফর্মটি ব্যবহার করুন। লগইন করার সময় পাসওয়ার্ড অবশ্যই সঠিকভাবে মিলতে হবে।
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">কার পাসওয়ার্ড পরিবর্তন করতে চান? *</label>
              <select
                value={pinTargetAdminId}
                onChange={(e) => setPinTargetAdminId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
              >
                <option value="all">সকল এডমিনের মাস্টার পিন (Master PIN)</option>
                {adminUsers.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.roleName}) - [{a.id}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {pinTargetAdminId === 'all'
                  ? 'বর্তমান মাস্টার পিন কোড * (ডিফল্ট: 1234)'
                  : 'নির্বাচিত কর্মকর্তার বর্তমান পাসওয়ার্ড *'}
              </label>
              <div className="relative">
                <input
                  type={showPinInputs ? 'text' : 'password'}
                  required
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  placeholder="বর্তমান পিন লিখুন"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
                />
                <button
                  type="button"
                  onClick={() => setShowPinInputs(!showPinInputs)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPinInputs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">নতুন পাসওয়ার্ড / পিন কোড * (কমপক্ষে ৪ সংখ্যা)</label>
              <input
                type={showPinInputs ? 'text' : 'password'}
                required
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড বা পিন দিন"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">নতুন পাসওয়ার্ড পুনরায় নিশ্চিত করুন *</label>
              <input
                type={showPinInputs ? 'text' : 'password'}
                required
                value={confirmPinInput}
                onChange={(e) => setConfirmPinInput(e.target.value)}
                placeholder="নতুন পাসওয়ার্ডটি পুনরায় লিখুন"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3664]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl font-extrabold shadow-xs flex items-center gap-1.5"
              >
                <KeyRound className="w-4 h-4 text-slate-950" />
                <span>পাসওয়ার্ড আপডেট করুন</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
