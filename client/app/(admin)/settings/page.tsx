"use client";

import { useState } from 'react';
import {
  Settings,
  Users,
  Monitor,
  Shield,
  Download,
  History,
  Building,
  Upload,
  Save,
  UserPlus,
  Edit,
  Trash2,
  Bell,
  Palette,
  Lock,
  Clock,
  Key,
  FileText,
  Database
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General Settings', icon: <Settings size={18} /> },
    { id: 'users', label: 'Users & Roles', icon: <Users size={18} /> },
    { id: 'system', label: 'System Preferences', icon: <Monitor size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'backup', label: 'Backup & Export', icon: <Download size={18} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'users':
        return <UsersSettings />;
      case 'system':
        return <SystemSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'backup':
        return <BackupSettings />;
      case 'audit':
        return <AuditSettings />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-y-auto">
        
        {/* Header - Neo Brutalist style */}
        <div className="relative border-4 border-black bg-blue-400 p-5 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Settings className="w-5 h-5 text-black" />
              </div>
              <span className="bg-white border-2 border-black font-mono font-bold text-[10px] uppercase px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Configuration</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase font-display tracking-tight text-black mb-2">
              System Settings
            </h1>
            <p className="font-bold text-black text-sm max-w-2xl border-l-4 border-black pl-3 bg-white/50 py-1.5 uppercase">
              Manage platform configurations, user roles, security, and preferences.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 h-12 px-6 font-black uppercase tracking-widest text-xs border-4 border-black transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-nb-cyan shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                  : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-nb-yellow hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
          {renderTabContent()}
        </div>

      </div>
    </>
  );
}

// -----------------------------------------------------------------------------
// TABS COMPONENTS
// -----------------------------------------------------------------------------

function GeneralSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Building className="w-6 h-6 text-black" />
        <h2 className="text-xl font-black uppercase tracking-widest border-b-4 border-black pb-1 inline-block">Company Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest">Company Name</label>
          <input type="text" defaultValue="ABC Business Solutions" className="w-full border-4 border-black bg-nb-bg h-14 px-4 font-bold uppercase focus:bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest">Email</label>
          <input type="email" defaultValue="contact@abc.com" className="w-full border-4 border-black bg-nb-bg h-14 px-4 font-bold uppercase focus:bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest">Phone</label>
          <input type="text" defaultValue="+1 234 567 8900" className="w-full border-4 border-black bg-nb-bg h-14 px-4 font-bold uppercase focus:bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest">Website</label>
          <input type="text" defaultValue="www.abc.com" className="w-full border-4 border-black bg-nb-bg h-14 px-4 font-bold uppercase focus:bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-black uppercase tracking-widest">Address</label>
          <input type="text" defaultValue="123 Business St, New York, NY 10001" className="w-full border-4 border-black bg-nb-bg h-14 px-4 font-bold uppercase focus:bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <label className="text-xs font-black uppercase tracking-widest">Company Logo</label>
        <div className="border-4 border-dashed border-black bg-nb-bg p-8 flex flex-col items-center justify-center gap-4 hover:bg-nb-yellow transition-colors cursor-pointer group">
          <div className="w-16 h-16 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-black" />
          </div>
          <span className="font-black uppercase tracking-widest text-sm">Click to upload logo</span>
        </div>
      </div>

      <div className="pt-6 border-t-4 border-black">
        <button className="bg-nb-green border-4 border-black h-14 px-8 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

function UsersSettings() {
  const users = [
    { name: 'Admin User', email: 'admin@company.com', role: 'Admin', status: 'active' },
    { name: 'Finance Manager', email: 'finance@company.com', role: 'Finance', status: 'active' },
    { name: 'Stock Manager', email: 'stock@company.com', role: 'Stock', status: 'active' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-black" />
          <h2 className="text-xl font-black uppercase tracking-widest border-b-4 border-black pb-1 inline-block">User Management</h2>
        </div>
        <button className="bg-nb-cyan border-4 border-black h-12 px-6 font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2">
          <UserPlus size={16} />
          Add User
        </button>
      </div>

      <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-nb-bg border-b-4 border-black">
              <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black">Name</th>
              <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black">Email</th>
              <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black">Role</th>
              <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black text-center">Status</th>
              <th className="p-4 font-black text-xs uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-b-4 border-black last:border-b-0 hover:bg-nb-yellow transition-colors">
                <td className="p-4 font-bold border-r-4 border-black">{u.name}</td>
                <td className="p-4 font-bold border-r-4 border-black">{u.email}</td>
                <td className="p-4 border-r-4 border-black">
                  <span className="bg-white border-2 border-black px-2 py-1 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{u.role}</span>
                </td>
                <td className="p-4 text-center border-r-4 border-black">
                  <span className="bg-nb-green border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">{u.status}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-nb-cyan shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors">
                      <Edit size={14} />
                    </button>
                    <button className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center hover:bg-nb-red hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SystemSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Notifications section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-black" />
          <h2 className="text-xl font-black uppercase tracking-widest border-b-4 border-black pb-1 inline-block">Notification Preferences</h2>
        </div>
        <div className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
          {[
            { title: 'Email Notifications', desc: 'Receive email alerts for important events', active: true },
            { title: 'SMS Notifications', desc: 'Get SMS alerts for critical updates', active: false },
            { title: 'In-app Notifications', desc: 'Show notifications within the application', active: true },
          ].map((item, i) => (
            <div key={i} className="p-6 border-b-4 border-black last:border-b-0 flex justify-between items-center hover:bg-nb-bg transition-colors">
              <div>
                <h3 className="font-black uppercase tracking-widest text-sm">{item.title}</h3>
                <p className="font-bold text-xs text-gray-600 mt-1 uppercase">{item.desc}</p>
              </div>
              <div className={`w-14 h-8 border-4 border-black flex items-center cursor-pointer transition-colors ${item.active ? 'bg-nb-green justify-end' : 'bg-gray-300 justify-start'}`}>
                <div className="w-5 h-5 bg-white border-4 border-black mx-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Section */}
      <div className="pt-8 border-t-4 border-black">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6 text-black" />
          <h2 className="text-xl font-black uppercase tracking-widest border-b-4 border-black pb-1 inline-block">Theme & Display</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest">Theme Mode</label>
            <select className="w-full border-4 border-black bg-nb-bg h-14 px-4 font-bold uppercase focus:bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] appearance-none cursor-pointer">
              <option>Light Mode</option>
              <option>Dark Mode</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest">Primary Color</label>
            <select className="w-full border-4 border-black bg-nb-bg h-14 px-4 font-bold uppercase focus:bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] appearance-none cursor-pointer">
              <option>Blue</option>
              <option>Green</option>
              <option>Yellow</option>
              <option>Red</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black uppercase tracking-widest">Date Format</label>
            <select className="w-full border-4 border-black bg-nb-bg h-14 px-4 font-bold uppercase focus:bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] appearance-none cursor-pointer">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>

        <div className="pt-6 mt-6">
          <button className="bg-nb-cyan border-4 border-black h-14 px-8 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
            Save Preferences
          </button>
        </div>
      </div>

    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-black" />
        <h2 className="text-xl font-black uppercase tracking-widest border-b-4 border-black pb-1 inline-block">Security Settings</h2>
      </div>

      <div className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
        <div className="p-6 border-b-4 border-black flex justify-between items-center hover:bg-nb-bg transition-colors">
          <div>
            <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2"><Lock size={16} /> Two-Factor Authentication (2FA)</h3>
            <p className="font-bold text-xs text-gray-600 mt-1 uppercase">Add an extra layer of security</p>
          </div>
          <div className="w-14 h-8 border-4 border-black flex items-center cursor-pointer transition-colors bg-gray-300 justify-start">
            <div className="w-5 h-5 bg-white border-4 border-black mx-1" />
          </div>
        </div>

        <div className="p-6 border-b-4 border-black flex justify-between items-center hover:bg-nb-bg transition-colors flex-wrap gap-4">
          <div>
            <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2"><Clock size={16} /> Session Timeout</h3>
            <p className="font-bold text-xs text-gray-600 mt-1 uppercase">Auto logout after inactivity</p>
          </div>
          <select className="border-4 border-black bg-white h-12 px-4 font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer">
            <option>15 min</option>
            <option selected>30 min</option>
            <option>60 min</option>
            <option>120 min</option>
          </select>
        </div>

        <div className="p-6 bg-blue-100">
          <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2 mb-4 text-blue-900"><Key size={16} /> Password Policy</h3>
          <ul className="space-y-2 font-bold text-xs uppercase text-blue-800">
            <li className="flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-blue-900 before:block">Minimum 8 characters</li>
            <li className="flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-blue-900 before:block">Must include uppercase and lowercase letters</li>
            <li className="flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-blue-900 before:block">Must include at least one number</li>
            <li className="flex items-center gap-2 before:content-[''] before:w-2 before:h-2 before:bg-blue-900 before:block">Must include at least one special character</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function BackupSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-6 h-6 text-black" />
        <h2 className="text-xl font-black uppercase tracking-widest border-b-4 border-black pb-1 inline-block">Data Export</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Export CSV', desc: 'Export data as CSV file', icon: Download, bg: 'bg-nb-cyan', btn: 'Download CSV' },
          { label: 'Export PDF', desc: 'Generate PDF reports', icon: FileText, bg: 'bg-nb-green', btn: 'Download PDF' },
          { label: 'Full Backup', desc: 'Complete database backup', icon: Database, bg: 'bg-blue-400', btn: 'Create Backup' },
        ].map((item, i) => (
          <div key={i} className={`border-4 border-black ${item.bg} p-6 flex flex-col items-center text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all`}>
            <div className="w-16 h-16 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-4">
              <item.icon className="w-8 h-8 text-black" />
            </div>
            <h3 className="font-black uppercase tracking-widest text-lg mb-1">{item.label}</h3>
            <p className="font-bold text-xs uppercase mb-6">{item.desc}</p>
            <button className="mt-auto bg-white border-4 border-black h-12 px-6 font-black uppercase tracking-widest text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-full hover:bg-black hover:text-white transition-colors">
              {item.btn}
            </button>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t-4 border-black mt-8">
        <h2 className="text-xl font-black uppercase tracking-widest mb-6">Automatic Backup Schedule</h2>
        
        <div className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
          <div className="p-6 border-b-4 border-black flex justify-between items-center hover:bg-nb-bg transition-colors">
            <div>
              <h3 className="font-black uppercase tracking-widest text-sm">Enable Automatic Backup</h3>
              <p className="font-bold text-xs text-gray-600 mt-1 uppercase">Schedule regular backups</p>
            </div>
            <div className="w-14 h-8 border-4 border-black flex items-center cursor-pointer transition-colors bg-black justify-end">
              <div className="w-5 h-5 bg-white border-4 border-black mx-1" />
            </div>
          </div>

          <div className="p-6 border-b-4 border-black">
            <label className="text-xs font-black uppercase tracking-widest block mb-2">Backup Frequency</label>
            <select className="w-full border-4 border-black bg-nb-bg h-14 px-4 font-bold uppercase focus:bg-white focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] appearance-none cursor-pointer max-w-sm">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          <div className="p-6 bg-nb-green">
            <p className="font-black text-xs uppercase tracking-widest">Last Backup: <span className="font-bold">2024-01-15 03:00 AM</span></p>
            <p className="font-black text-xs uppercase tracking-widest mt-1">Status: <span className="font-bold text-black border-b-2 border-black">Successful</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditSettings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-6 h-6 text-black" />
        <h2 className="text-xl font-black uppercase tracking-widest border-b-4 border-black pb-1 inline-block">Audit Logs</h2>
      </div>
      <div className="border-4 border-black border-dashed p-12 text-center bg-nb-bg">
        <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="font-black uppercase tracking-widest text-lg mb-2">System Audit Logs</h3>
        <p className="font-bold text-sm uppercase max-w-md mx-auto">This section would display a chronological record of all system activities and administrative actions.</p>
      </div>
    </div>
  );
}
