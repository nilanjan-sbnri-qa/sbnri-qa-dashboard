import React, { useState } from 'react';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('sbnri_auth') === 'true');
    const [userIdInput, setUserIdInput] = useState(() => localStorage.getItem('sbnri_userId') || '');
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState('');

    const [requirePasswordChange, setRequirePasswordChange] = useState(false);
    const [newPasswordInput, setNewPasswordInput] = useState('');

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteSuccessMsg, setInviteSuccessMsg] = useState('');
    const [isInviting, setIsInviting] = useState(false);

    // Dummy PR data
    const [prs] = useState([
        { id: 1, title: 'Fix KYC OTP Issue', author: 'dev-john', platform: 'Backend', status: 'Un-tested', date: '2026-02-23' },
        { id: 2, title: 'Update Mutual Fund List UI', author: 'dev-jane', platform: 'Android', status: 'Merged', date: '2026-02-23' },
        { id: 3, title: 'iOS SIP Flow Error', author: 'dev-mark', platform: 'iOS', status: 'Open', date: '2026-02-22' },
        { id: 4, title: 'Optimize Portfolio Query', author: 'dev-alice', platform: 'Backend', status: 'Tested', date: '2026-02-22' },
    ]);

    const stats = {
        total: prs.length,
        backend: prs.filter(pr => pr.platform === 'Backend').length,
        android: prs.filter(pr => pr.platform === 'Android').length,
        ios: prs.filter(pr => pr.platform === 'iOS').length,
        untested: prs.filter(pr => pr.status === 'Un-tested').length,
    };

    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPrs = React.useMemo(() => {
        let result = prs;

        if (activeFilter !== 'All') {
            if (activeFilter === 'Action Needed') {
                result = result.filter(pr => pr.status === 'Un-tested');
            } else {
                result = result.filter(pr => pr.platform === activeFilter);
            }
        }

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(pr =>
                pr.title.toLowerCase().includes(query) ||
                pr.author.toLowerCase().includes(query) ||
                (1000 + pr.id).toString().includes(query)
            );
        }

        return result;
    }, [prs, activeFilter, searchQuery]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError('');
        try {
            const res = await fetch('https://sbnri-qa-dashboard.onrender.com/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userIdInput, password: passwordInput })
            });
            const data = await res.json();
            if (data.success) {
                if (data.requirePasswordChange) {
                    setRequirePasswordChange(true);
                    setAuthError('For security, you must change your auto-generated password.');
                } else {
                    localStorage.setItem('sbnri_auth', 'true');
                    localStorage.setItem('sbnri_userId', userIdInput);
                    setIsAuthenticated(true);
                }
            } else {
                setAuthError(data.message || 'Invalid User ID or Password.');
            }
        } catch (e) {
            setAuthError('Cannot connect to authentication server. Is the QA Node.js backend running?');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setAuthError('');
        try {
            const res = await fetch('https://sbnri-qa-dashboard.onrender.com/api/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userIdInput, oldPassword: passwordInput, newPassword: newPasswordInput })
            });
            const data = await res.json();
            if (data.success) {
                setRequirePasswordChange(false);
                localStorage.setItem('sbnri_auth', 'true');
                localStorage.setItem('sbnri_userId', userIdInput);
                setIsAuthenticated(true);
                setPasswordInput(''); // Clear the old password from state
                setNewPasswordInput('');
            } else {
                setAuthError(data.message || 'Failed to change password.');
            }
        } catch (e) {
            setAuthError('Cannot connect to authentication server.');
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        if (inviteEmail) {
            setIsInviting(true);
            setInviteSuccessMsg('');
            try {
                const res = await fetch('https://sbnri-qa-dashboard.onrender.com/api/invite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: inviteEmail })
                });
                const data = await res.json();

                if (data.success) {
                    if (data.previewUrl) {
                        setInviteSuccessMsg(`Email sent! (Sent via Ethereal trial mode: Check node console or wait for real SMTP).`);
                        console.log("TEST EMAIL URL:", data.previewUrl);
                    } else {
                        setInviteSuccessMsg('Secure invite email sent successfully!');
                    }
                    setInviteEmail('');
                } else {
                    setInviteSuccessMsg('Failed to send invite.');
                }
            } catch (e) {
                setInviteSuccessMsg('Server error. Backend running?');
            }
            setIsInviting(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Merged': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Open': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
            case 'Un-tested': return 'bg-rose-100 text-rose-800 border-rose-200';
            case 'Tested': return 'bg-violet-100 text-violet-800 border-violet-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'Backend':
                return (
                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            case 'Android':
                return (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#3DDC84]">
                        <path d="M17.523 15.341c-.55 0-.999-.45-.999-.999 0-.55.449-.999.999-.999.55 0 .999.449.999.999 0 .549-.449.999-.999.999m-11.046 0c-.55 0-.999-.45-.999-.999 0-.55.449-.999.999-.999.55 0 .999.449.999.999 0 .549-.449.999-.999.999m11.412-7.234l1.734-3.004c.057-.099.025-.226-.074-.284-.099-.057-.226-.025-.284.074l-1.769 3.064c-1.637-.743-3.52-.1165-5.545-1.165-2.025 0-3.908.422-5.545 1.165L4.637 4.888C4.579 4.789 4.452 4.757 4.353 4.814c-.099.058-.131.185-.074.284l1.734 3.004C2.516 9.873 0 13.9 0 18.52h24c0-4.62-2.516-8.647-6.011-10.413" />
                    </svg>
                );
            case 'iOS':
                return (
                    <svg viewBox="0 0 512 512" className="w-5 h-5 fill-slate-800">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                );
            default:
                return <span className="text-xl">💻</span>;
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-100 relative font-['Inter',sans-serif]">
                <div className="mx-auto w-full max-w-md relative z-10">
                    <h2 className="mt-6 text-center text-3xl font-black text-slate-900 tracking-tight">
                        <span className="text-blue-900">SBNRI</span> QA Center
                    </h2>
                    <p className="mt-2 text-center text-sm font-medium text-slate-500 uppercase tracking-widest">
                        Internal Access Portal
                    </p>
                </div>

                <div className="mt-8 mx-auto w-full max-w-md relative z-10">
                    <div className="bg-white py-8 px-6 shadow-sm rounded-2xl sm:px-10 border border-slate-100">
                        {authError && (
                            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-md text-sm text-center">
                                {authError}
                            </div>
                        )}

                        {requirePasswordChange ? (
                            <form className="space-y-6" onSubmit={handleChangePassword}>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">User ID</label>
                                    <div className="mt-1 text-sm font-bold text-slate-900 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md">
                                        {userIdInput}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">New Password</label>
                                    <div className="mt-1">
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            required
                                            minLength={8}
                                            value={newPasswordInput}
                                            onChange={(e) => setNewPasswordInput(e.target.value)}
                                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Min 8 characters"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 focus:outline-none transition-colors"
                                    >
                                        Update Password & Login
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form className="space-y-6" onSubmit={handleLogin}>
                                <div>
                                    <label htmlFor="userId" className="block text-sm font-medium text-slate-700">
                                        User ID
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="userId"
                                            name="userId"
                                            type="text"
                                            required
                                            value={userIdInput}
                                            onChange={(e) => setUserIdInput(e.target.value)}
                                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="e.g. admin"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                        Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            value={passwordInput}
                                            onChange={(e) => setPasswordInput(e.target.value)}
                                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Enter Invite Password"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 transition-colors"
                                    >
                                        Verify Credentials
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-['Inter',sans-serif] selection:bg-blue-100 relative pb-20">

            {/* Invite Modal Overlay */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900">Invite Team Member</h3>
                            <button
                                onClick={() => { setShowInviteModal(false); setInviteSuccessMsg(''); setIsInviting(false); }}
                                className="text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {inviteSuccessMsg ? (
                            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-lg text-sm text-center font-mono">
                                {inviteSuccessMsg}
                            </div>
                        ) : (
                            <form onSubmit={handleInvite} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Colleague's Email</label>
                                    <input type="email" required value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="dev@sbnri.com" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isInviting}
                                    className={`w-full flex justify-center py-2.5 rounded-lg font-bold text-white transition ${isInviting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'}`}
                                >
                                    {isInviting ? 'Sending Secure Email...' : 'Generate & Email Password'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Header */}
                <header className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl mb-2">
                            <span className="text-blue-900">SBNRI</span> QA Center
                        </h1>
                        <p className="text-base font-medium text-slate-500 max-w-2xl">
                            Intelligent test orchestration & PR monitoring dashboard.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-4 md:mt-0">
                        {userIdInput === 'admin' && (
                            <button onClick={() => setShowInviteModal(true)} className="text-sm font-bold text-blue-900 bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-200 px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-sm">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                Invite Users
                            </button>
                        )}
                        <button
                            onClick={() => {
                                localStorage.removeItem('sbnri_auth');
                                localStorage.removeItem('sbnri_userId');
                                setIsAuthenticated(false);
                                setUserIdInput('');
                                setPasswordInput('');
                                setRequirePasswordChange(false);
                                setNewPasswordInput('');
                            }}
                            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Sign Out ({userIdInput})
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                    {/* Total */}
                    <div
                        onClick={() => setActiveFilter('All')}
                        className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col justify-center transform hover:-translate-y-1 transition-all duration-300 cursor-pointer ${activeFilter === 'All' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-100'}`}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-500 tracking-widest">TOTAL PRs</h3>
                            <div className="p-2 bg-slate-50 rounded-lg"><svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
                        </div>
                        <p className="text-5xl font-black mt-4 text-slate-900">{stats.total}</p>
                    </div>

                    {/* Action Needed */}
                    <div
                        onClick={() => setActiveFilter('Action Needed')}
                        className={`bg-gradient-to-br from-rose-50 to-white rounded-2xl shadow-sm border p-6 flex flex-col justify-center transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden cursor-pointer ${activeFilter === 'Action Needed' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-rose-100'}`}
                    >
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-100/50 rounded-full blur-2xl"></div>
                        <div className="flex items-center justify-between relative z-10">
                            <h3 className="text-sm font-semibold text-rose-600 tracking-widest">ACTION NEEDED</h3>
                            <div className="p-2 bg-rose-100 rounded-lg"><svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
                        </div>
                        <p className="text-5xl font-black mt-4 text-rose-700 relative z-10">{stats.untested}</p>
                    </div>

                    {/* Backend */}
                    <div
                        onClick={() => setActiveFilter('Backend')}
                        className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col justify-center transform hover:-translate-y-1 transition-all duration-300 cursor-pointer ${activeFilter === 'Backend' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-100'}`}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-500 tracking-widest">BACKEND</h3>
                            <div className="p-2 bg-blue-50 rounded-lg">{getPlatformIcon('Backend')}</div>
                        </div>
                        <p className="text-4xl font-black mt-4 text-blue-900">{stats.backend}</p>
                    </div>

                    {/* Android */}
                    <div
                        onClick={() => setActiveFilter('Android')}
                        className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col justify-center transform hover:-translate-y-1 transition-all duration-300 cursor-pointer ${activeFilter === 'Android' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-100'}`}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-500 tracking-widest">ANDROID</h3>
                            <div className="p-2 bg-emerald-50 rounded-lg">{getPlatformIcon('Android')}</div>
                        </div>
                        <p className="text-4xl font-bold mt-4 text-slate-800">{stats.android}</p>
                    </div>

                    {/* iOS */}
                    <div
                        onClick={() => setActiveFilter('iOS')}
                        className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col justify-center transform hover:-translate-y-1 transition-all duration-300 cursor-pointer ${activeFilter === 'iOS' ? 'border-slate-800 ring-2 ring-slate-800/20' : 'border-slate-100'}`}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-500 tracking-widest">iOS</h3>
                            <div className="p-2 bg-slate-50 rounded-lg">{getPlatformIcon('iOS')}</div>
                        </div>
                        <p className="text-4xl font-bold mt-4 text-slate-800">{stats.ios}</p>
                    </div>
                </div>

                {/* PR Table Area */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-4 sm:px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Pull Requests</h2>
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full sm:w-auto">
                            <div className="relative w-full sm:w-auto">
                                <input
                                    type="text"
                                    placeholder="Search PRs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none w-full sm:w-64 transition-all"
                                />
                                <svg className="w-4 h-4 text-slate-400 absolute left-4 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-900 hover:bg-blue-800 shadow-sm transition-all duration-200 w-full sm:w-auto">
                                Deploy Test Runner
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-bold uppercase tracking-widest text-slate-500">
                                    <th className="px-4 sm:px-8 py-5">System</th>
                                    <th className="px-4 sm:px-8 py-5">Pull Request</th>
                                    <th className="px-4 sm:px-8 py-5 hidden sm:table-cell">Developer</th>
                                    <th className="px-4 sm:px-8 py-5 hidden md:table-cell">Opened</th>
                                    <th className="px-4 sm:px-8 py-5 text-right w-48">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredPrs.map((pr) => (
                                    <tr key={pr.id} className="hover:bg-indigo-50/30 transition-colors group cursor-pointer">
                                        <td className="px-4 sm:px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg shadow-inner min-w-[40px]">
                                                    {getPlatformIcon(pr.platform)}
                                                </div>
                                                <span className="font-semibold text-slate-700">{pr.platform}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors text-base">{pr.title}</span>
                                                <span className="text-sm text-slate-500 font-mono mt-1">#{1000 + pr.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-8 py-5 hidden sm:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-400 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                                    {pr.author.charAt(4).toUpperCase()}
                                                </div>
                                                <span className="text-slate-600 font-medium">{pr.author}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-8 py-5 hidden md:table-cell text-slate-500 font-medium">{pr.date}</td>
                                        <td className="px-4 sm:px-8 py-5 text-right whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(pr.status)} shadow-sm`}>
                                                {pr.status === 'Un-tested' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2 animate-pulse"></span>}
                                                {pr.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-4 sm:px-8 py-4 bg-slate-50 text-sm text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100">
                        <p className="text-center sm:text-left">Showing <span className="font-medium text-slate-900">{filteredPrs.length}</span> results {activeFilter !== 'All' && `(filtered by ${activeFilter})`}</p>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-slate-200 text-slate-400">&larr;</button>
                            <button className="w-8 h-8 rounded flex items-center justify-center bg-indigo-600 text-white font-medium shadow-sm">1</button>
                            <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-slate-200 text-slate-700">2</button>
                            <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-slate-200 text-slate-400">&rarr;</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default App;
