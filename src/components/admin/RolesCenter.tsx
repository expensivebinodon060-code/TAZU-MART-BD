import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Copy, 
  Check, 
  X, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  Unlock, 
  History, 
  Save, 
  Plus, 
  AlertCircle,
  Info,
  MoreVertical
} from 'lucide-react';
import { 
  AdminRole, 
  ModulePermissions, 
  PermissionAction, 
  RoleAuditLog 
} from '../../types';

const MODULES = [
  'Dashboard', 'Orders', 'Products', 'Customers', 'Finance', 
  'Reports', 'Marketing', 'Disputes', 'Settings', 'SEO', 
  'Users', 'Inventory', 'Notifications'
];

const ACTIONS: PermissionAction[] = ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve', 'Reject'];

export default function RolesCenter() {
  const [activeTab, setActiveTab] = useState<'roles' | 'audit'>('roles');
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Mock Data
  const roles: AdminRole[] = [
    {
      id: 'ROLE-1',
      name: 'Super Admin',
      description: 'Full system access with all permissions enabled.',
      isSystemRole: true,
      permissions: MODULES.map(m => ({
        moduleId: m.toLowerCase(),
        moduleName: m,
        actions: ACTIONS.reduce((acc, a) => ({ ...acc, [a]: true }), {} as Record<PermissionAction, boolean>)
      })),
      createdAt: '2026-01-01',
      updatedAt: '2026-02-28'
    },
    {
      id: 'ROLE-2',
      name: 'Manager',
      description: 'Operational management with limited financial access.',
      isSystemRole: false,
      permissions: MODULES.map(m => ({
        moduleId: m.toLowerCase(),
        moduleName: m,
        actions: ACTIONS.reduce((acc, a) => ({ ...acc, [a]: m !== 'Finance' }), {} as Record<PermissionAction, boolean>)
      })),
      createdAt: '2026-01-15',
      updatedAt: '2026-02-20'
    }
  ];

  const auditLogs: RoleAuditLog[] = [
    {
      id: 'LOG-1',
      adminId: 'ADM-001',
      adminName: 'Super Admin',
      action: 'Role Updated',
      targetRoleName: 'Manager',
      details: 'Updated Finance View permission to False',
      ipAddress: '192.168.1.1',
      timestamp: '2026-02-28 10:30'
    }
  ];

  const renderRoleList = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[#EAEAEA]">Role Management</h2>
          <p className="text-sm text-secondary">Define and manage access levels for your administrative team.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedRole({
              id: `ROLE-${Date.now()}`,
              name: '',
              description: '',
              isSystemRole: false,
              permissions: MODULES.map(m => ({
                moduleId: m.toLowerCase(),
                moduleName: m,
                actions: ACTIONS.reduce((acc, a) => ({ ...acc, [a]: false }), {} as Record<PermissionAction, boolean>)
              })),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            setIsEditing(true);
          }}
          className="px-6 py-3 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all flex items-center gap-2 shadow-lg shadow-active/20"
        >
          <Plus size={18} />
          Create New Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div 
            key={role.id} 
            className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6 group hover:border-white/10 transition-all relative overflow-hidden"
          >
            {role.isSystemRole && (
              <div className="absolute top-4 right-4 px-2 py-1 bg-active/10 text-active rounded-lg text-[8px] font-black uppercase tracking-widest">
                System Role
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${role.isSystemRole ? 'bg-active/10 text-active' : 'bg-white/5 text-secondary'}`}>
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#EAEAEA]">{role.name}</h3>
                <p className="text-[10px] text-secondary font-medium">ID: {role.id}</p>
              </div>
            </div>
            <p className="text-xs text-secondary leading-relaxed line-clamp-2">
              {role.description}
            </p>
            <div className="pt-4 flex items-center justify-between border-t border-white/5">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-secondary" />
                <span className="text-xs font-bold text-[#EAEAEA]">12 Admins</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setSelectedRole(role); setIsEditing(true); }}
                  className="p-2 hover:bg-white/5 rounded-lg text-secondary hover:text-active transition-all"
                >
                  <Edit size={16} />
                </button>
                {!role.isSystemRole && (
                  <button className="p-2 hover:bg-white/5 rounded-lg text-secondary hover:text-rose-400 transition-all">
                    <Trash2 size={16} />
                  </button>
                )}
                <button className="p-2 hover:bg-white/5 rounded-lg text-secondary hover:text-active transition-all">
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPermissionMatrix = () => {
    if (!selectedRole) return null;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => { setSelectedRole(null); setIsEditing(false); }}
            className="flex items-center gap-2 text-secondary hover:text-active transition-all group"
          >
            <X size={20} />
            <span className="text-sm font-bold">Cancel Editing</span>
          </button>
          <button className="px-8 py-3 bg-active text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-active/20 hover:bg-active/90 transition-all">
            <Save size={18} />
            Save Role & Permissions
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
              <h3 className="text-lg font-bold text-[#EAEAEA]">Role Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Role Name</label>
                  <input 
                    type="text" 
                    value={selectedRole.name}
                    onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                    disabled={selectedRole.isSystemRole}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Description</label>
                  <textarea 
                    value={selectedRole.description}
                    onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
                    disabled={selectedRole.isSystemRole}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all h-32 resize-none disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-[32px] flex items-start gap-4">
              <AlertCircle className="text-amber-400 shrink-0" size={20} />
              <p className="text-[10px] text-secondary leading-relaxed">
                <span className="font-bold text-amber-400">Security Note:</span> Changes to permissions will take effect immediately for all users assigned to this role upon their next action or page refresh.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-card border border-white/5 rounded-[40px] overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-sm font-bold text-[#EAEAEA] flex items-center gap-2">
                <Shield size={18} className="text-active" />
                Permission Matrix
              </h3>
              <div className="flex items-center gap-4">
                <button className="text-[10px] font-bold text-active uppercase tracking-widest hover:underline">Select All</button>
                <button className="text-[10px] font-bold text-secondary uppercase tracking-widest hover:underline">Deselect All</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Module</th>
                    {ACTIONS.map(action => (
                      <th key={action} className="px-4 py-4 text-center text-[10px] font-bold text-secondary uppercase tracking-widest">
                        {action}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {selectedRole.permissions.map((perm) => (
                    <tr key={perm.moduleId} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-[#EAEAEA]">{perm.moduleName}</span>
                      </td>
                      {ACTIONS.map(action => (
                        <td key={action} className="px-4 py-4 text-center">
                          <button 
                            disabled={selectedRole.isSystemRole}
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center mx-auto transition-all ${
                              perm.actions[action] 
                                ? 'bg-active border-active text-white' 
                                : 'bg-white/5 border-white/10 text-transparent hover:border-active/50'
                            }`}
                          >
                            <Check size={14} />
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAuditLogs = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#EAEAEA]">Permission Audit Logs</h2>
          <p className="text-sm text-secondary">Track every change made to roles and permissions for security auditing.</p>
        </div>
        <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-secondary hover:text-active transition-all">
          <History size={20} />
        </button>
      </div>

      <div className="bg-card border border-white/5 rounded-[40px] overflow-hidden">
        <div className="divide-y divide-white/5">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-6 flex items-start justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-secondary mt-1">
                  <Lock size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#EAEAEA]">{log.action}</span>
                    <span className="text-[10px] text-secondary font-mono">{log.ipAddress}</span>
                  </div>
                  <p className="text-xs text-secondary mt-1">
                    <span className="font-bold text-active">{log.adminName}</span> {log.details}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-secondary">{log.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[8px] font-black uppercase tracking-widest">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      {!isEditing && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-active/10 text-active rounded-2xl flex items-center justify-center">
              <Shield size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#EAEAEA]">Roles & Permissions</h1>
              <p className="text-sm text-secondary">TAZU MART BD-grade RBAC system for secure administrative control.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-card border border-white/5 p-1.5 rounded-2xl">
            <button 
              onClick={() => setActiveTab('roles')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'roles' ? 'bg-active text-white shadow-lg shadow-active/20' : 'text-secondary hover:text-primary'}`}
            >
              Role Management
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'audit' ? 'bg-active text-white shadow-lg shadow-active/20' : 'text-secondary hover:text-primary'}`}
            >
              Audit Logs
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div key="edit">
              {renderPermissionMatrix()}
            </motion.div>
          ) : (
            <motion.div key={activeTab}>
              {activeTab === 'roles' ? renderRoleList() : renderAuditLogs()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
