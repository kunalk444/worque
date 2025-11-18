import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { handlePendingRequests } from '../pendingRequestHelper';

function PendingRequests() {
    const [pendingRequests, setPendingRequests] = useState();
    const [acceptFlag, setAcceptFlag] = useState(false);
    const [rejectFlag, setRejectFlag] = useState(false);
    const user = useSelector(state => state.user);

    useEffect(() => {
        (async () => {
            const res = await fetch("http://localhost:5000/user/pendingRequests", {
                method: "POST",
                body: JSON.stringify({ email: user.email }),
                headers: {
                    "Content-type": "application/json"
                }
            });
            const obj = await res.json();
            setPendingRequests(obj);
        })();
    }, [user.email, acceptFlag, rejectFlag]);

    acceptFlag && setTimeout(() => setAcceptFlag(false), 1700);
    rejectFlag && setTimeout(() => setRejectFlag(false), 1700);

    return (
        <div className="w-screen min-h-screen bg-[#f1f5f9] relative overflow-y-auto p-8">

            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h20v20H0z%22 fill=%22none%22/%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(20,184,166,0.06)%22/%3E%3Ccircle cx=%229%22 cy=%229%22 r=%221%22 fill=%22rgba(20,184,166,0.06)%22/%3E%3Ccircle cx=%2219%22 cy=%2219%22 r=%221%22 fill=%22rgba(20,184,166,0.06)%22/%3E%3C/svg%3E')] opacity-50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(45,212,191,0.12),transparent_70%)]"></div>

            <div className="relative z-10 max-w-4xl mx-auto">

                <h1 className="text-5xl font-extrabold text-[#1e293b] mb-14 tracking-tight text-center">
                    Pending Requests
                </h1>

                {acceptFlag && (
                    <h4 className="text-2xl font-semibold text-[#1e293b] bg-[#2dd4bf]/20 px-6 py-3 rounded-xl text-center mb-8 shadow-md animate-pulse">
                        Request Accepted!
                    </h4>
                )}

                {rejectFlag && (
                    <h4 className="text-2xl font-semibold text-[#1e293b] bg-[#f87171]/20 px-6 py-3 rounded-xl text-center mb-8 shadow-md animate-pulse">
                        Request Rejected!
                    </h4>
                )}

                {pendingRequests && Object.keys(pendingRequests.requests).map((ele, index) => (
                    <div
                        key={index}
                        className="relative bg-white rounded-2xl p-6 mb-8 shadow-xl border-l-6 border-[#2dd4bf] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h20v20H0z%22 fill=%22none%22/%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(45,212,191,0.05)%22/%3E%3Ccircle cx=%229%22 cy=%229%22 r=%221%22 fill=%22rgba(45,212,191,0.05)%22/%3E%3Ccircle cx=%2219%22 cy=%2219%22 r=%221%22 fill=%22rgba(45,212,191,0.05)%22/%3E%3C/svg%3E')] opacity-40"></div>

                        <div className="relative z-10">
                            <h2 className="text-xl font-semibold text-[#1e293b] mb-3">
                                Task Description: {pendingRequests.requests[ele][0]}
                            </h2>

                            <h2 className="text-xl font-semibold text-[#1e293b] mb-3">
                                Task Priority: {pendingRequests.requests[ele][1]}
                            </h2>

                            <h2 className="text-xl font-semibold text-[#1e293b] mb-6">
                                Admin: {pendingRequests.requests[ele][2]}
                            </h2>

                            <div className="flex gap-5">
                                <button
                                    className="bg-[#2dd4bf] text-[#1e293b] px-6 py-2 rounded-xl hover:bg-[#f87171] hover:text-white transition-all duration-300 font-semibold shadow-md"
                                    onClick={async () => {
                                        const obj = await handlePendingRequests(user.id, ele, "accept");
                                        if (obj.success) setAcceptFlag(true);
                                    }}
                                >
                                    Accept
                                </button>

                                <button
                                    className="bg-[#f87171] text-white px-6 py-2 rounded-xl hover:bg-[#2dd4bf] hover:text-[#1e293b] transition-all duration-300 font-semibold shadow-md"
                                    onClick={async () => {
                                        const obj = await handlePendingRequests(user.id, ele, "reject");
                                        if (obj.success) setRejectFlag(true);
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PendingRequests;
