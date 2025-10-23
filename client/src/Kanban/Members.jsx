import React from 'react';

function Members(props) {
  if (!props.show) return;
  const { stopShow, type, members } = props;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-10 max-w-3xl w-full shadow-xl relative h-[70vh] overflow-y-auto border-l-4 border-[#0d9488]">
        <button
          onClick={stopShow}
          className="absolute top-8 right-8 text-4xl font-bold text-gray-700 hover:text-gray-900 transition-colors duration-300 bg-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100"
        >
          X
        </button>
        <h2 className="text-4xl font-extrabold text-[#0d9488] mb-10 tracking-wide">{type}</h2>
        {
          members && members.map((name, index) => {
            return (
              <p key={index} className="text-xl text-gray-800 font-medium mb-6">
                {name}
              </p>
            );
          })
        }
      </div>
    </div>
  );
}

export default Members;