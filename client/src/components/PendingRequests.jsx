import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { handlePendingRequests } from '../pendingRequestHelper';

function PendingRequests() {
    const [pendingRequests, setPendingRequests] = useState();
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
            console.log(obj);
        })();
    }, [user.email]);

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-[#0d9488] to-[#7c3aed] p-8 overflow-y-auto">
            <h1 className="text-5xl font-extrabold text-white mb-12 tracking-wide text-center">Pending Requests</h1>
            {
                pendingRequests && Object.keys(pendingRequests.requests).map((ele, index) => {
                    return (
                        <div key={index} className="bg-white p-4 rounded-xl mb-8 shadow-md border-l-4 border-[#0d9488]">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Task Description: {pendingRequests.requests[ele][0]}</h2>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Task Priority: {pendingRequests.requests[ele][1]}</h2>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin: {pendingRequests.requests[ele][2]}</h2>
                            <div className="flex space-x-4">
                                <button className="bg-white text-[#0d9488] px-4 py-2 rounded-lg hover:bg-teal-100 transition duration-300 text-lg font-semibold shadow-md hover:shadow-lg border-2 border-[#0d9488]"
                                        onClick={()=>{
                                          handlePendingRequests(ele,"accept");
                                        }}
                                >
                                    Accept
                                </button>
                                <button className="bg-white text-[#7c3aed] px-4 py-2 rounded-lg hover:bg-purple-100 transition duration-300 text-lg font-semibold shadow-md hover:shadow-lg border-2 border-[#7c3aed]"
                                        onClick={()=>{
                                            handlePendingRequests(ele,"reject");
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