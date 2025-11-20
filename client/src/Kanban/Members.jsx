import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function Members(props) {
  const emailRef = useRef(null);
  const [addMemberMessage, setAddMemberMessage] = useState(false);
  if (!props.show) return null;

  const { stopShow, type, members, id } = props;

  async function handleAddMembers() {
    const emailId = emailRef.current.value;
    emailRef.current.value = "";
    const res = await fetch("http://localhost:5000/tasks/addmembers", {
      method: 'POST',
      body: JSON.stringify({ emailId, id }),
      credentials: 'include',
      headers: { 'Content-type': 'application/json' }
    });
    const data = await res.json();
    if (data.success) setAddMemberMessage(true);
  }

  addMemberMessage && setTimeout(() => setAddMemberMessage(false), 1500);

  return createPortal(
    <>
      <div className="fixed inset-0 bg-[#1e293b]/80 backdrop-blur-xl z-[300000]" onClick={stopShow} />

      <div className="fixed inset-0 flex items-center justify-center z-[300001] pointer-events-none">
        <div className="bg-[#ffffff] rounded-2xl p-10 w-full max-w-2xl shadow-2xl relative pointer-events-auto 
                        border-4 border-[#14b8a6]/50 h-[70vh] overflow-y-auto
                        bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h20v20H0z%22 fill=%22none%22/%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(20,184,166,0.12)%22/%3E%3Ccircle cx=%229%22 cy=%229%22 r=%221%22 fill=%22rgba(20,184,166,0.12)%22/%3E%3Ccircle cx=%2219%22 cy=%2219%22 r=%221%22 fill=%22rgba(20,184,166,0.12)%22/%3E%3C/svg%3E')] 
                        bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.22),transparent_70%)] 
                        shadow-2xl ring-8 ring-[#14b8a6]/10">

          <button
            onClick={stopShow}
            className="absolute top-4 right-4 text-[#0f172a] hover:text-[#ef4444] text-2xl font-bold 
                       w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center 
                       hover:scale-110 hover:shadow-2xl transition-all z-50"
          >
            X
          </button>

          <h2 className="text-4xl font-extrabold text-[#0f172a] mb-10 text-center tracking-tight">
            {type === "current" ? "Team Members" : "Pending Requests"}
          </h2>

          {addMemberMessage && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-[#14b8a6] text-white px-10 py-4 
                            rounded-full font-bold text-xl shadow-2xl animate-bounce z-50">
              Request Sent
            </div>
          )}

          <div className="space-y-5 mb-12">
            {members && members.length > 0 ? (
              members.map((name, index) => (
                <div key={index} className="flex items-center gap-5 p-5 bg-[#14b8a6]/10 rounded-2xl border-2 border-[#14b8a6]/30 hover:bg-[#14b8a6]/15 transition">
                  <div className="w-14 h-14 bg-[#14b8a6] rounded-full flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-xl font-bold text-[#0f172a]">{name}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-[#0f172a]/60 font-semibold text-lg">No members yet</p>
            )}
          </div>

          {type === "current" && (
            <div className="mt-10 p-8 bg-gradient-to-br from-[#14b8a6]/10 to-[#ef4444]/5 rounded-2xl border-4 border-[#14b8a6]/30">
              <h3 className="text-2xl font-bold text-[#0f172a] mb-6">Add New Member</h3>
              <div className="flex gap-4">
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="Enter email address"
                  className="flex-1 px-6 py-4 rounded-2xl border-4 border-[#0f172a]/20 focus:outline-none focus:ring-4 focus:ring-[#14b8a6]/50 bg-white text-[#0f172a] font-semibold text-lg shadow-inner"
                />
                <button
                  onClick={handleAddMembers}
                  className="px-10 py-4 bg-[#14b8a6] text-white font-extrabold text-xl rounded-2xl 
                           hover:bg-[#ef4444] hover:shadow-2xl hover:scale-105 
                           transition-all duration-300 shadow-xl"
                >
                  Send Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

export default Members;