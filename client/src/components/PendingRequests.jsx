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

    acceptFlag && setTimeout(() => {
        setAcceptFlag(false);
    }, 1700);
    rejectFlag && setTimeout(() => {
        setRejectFlag(false);
    }, 1700);

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-[#0d9488] to-[#7c3aed] p-5 overflow-y-auto">
            <h1 className="text-6xl font-extrabold text-white mb-16 tracking-wide text-center">Pending Requests</h1>
            {acceptFlag && <h4 className="text-2xl font-medium text-black bg-white px-6 py-3 rounded-lg text-center mb-8 shadow-md animate-pulse">Request Accepted!</h4>}
            {rejectFlag && <h4 className="text-2xl font-medium text-black bg-white px-6 py-3 rounded-lg text-center mb-8 shadow-md animate-pulse">Request Rejected!</h4>}
            {
                pendingRequests && Object.keys(pendingRequests.requests).map((ele, index) => {
                    return (
                        <div key={index} className="bg-white p-4 rounded-2xl mb-7 shadow-lg border-l-4 border-[#0d9488]">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Description: {pendingRequests.requests[ele][0]}</h2>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Priority: {pendingRequests.requests[ele][1]}</h2>
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Admin: {pendingRequests.requests[ele][2]}</h2>
                            <div className="flex space-x-6">
                                <button
                                    className="bg-white text-[#0d9488] px-5 py-2.5 rounded-xl hover:bg-teal-100 transition duration-300 text-lg font-semibold shadow-md hover:shadow-lg border-2 border-[#0d9488]"
                                    onClick={async () => {
                                        console.log("clicked!");
                                        const obj = await handlePendingRequests(user.id, ele, "accept");
                                        if (obj.success) setAcceptFlag(true);
                                    }}
                                >
                                    Accept
                                </button>
                                <button
                                    className="bg-white text-[#7c3aed] px-5 py-2.5 rounded-xl hover:bg-purple-100 transition duration-300 text-lg font-semibold shadow-md hover:shadow-lg border-2 border-[#7c3aed]"
                                    onClick={async () => {
                                        console.log("clicked!");
                                        const obj = await handlePendingRequests(user.id, ele, "reject");
                                        if (obj.success) setRejectFlag(true);
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default PendingRequests;