import React, { useState,useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const Another = () => {
  const [weeks, setWeeks] = useState({ weeks: [] });
  const [showModal, setShowModal] = useState(false);
  const [newWeek, setNewWeek] = useState({ week_number: '', modules: [], position: 'before' });
  const [activeWeek, setActiveWeek] = useState(weeks.weeks[0]?.id);

  useEffect(() =>{
    fetch('data.json')
    .then(res => res.json())
    .then(data =>{
      console.log(data)
      setWeeks(data)
    })
  },[])

  console.log("set",weeks.weeks)
  const handleAddWeek = (position) => {
    setShowModal(true);
    setNewWeek({ week_number: '', modules: [], position });
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleWeekSubmit = () => {
    const { week_number, modules, position } = newWeek;
    const weekNumberInt = parseInt(week_number);
    if (weekNumberInt > 0 && modules.length > 0) {
      const updatedWeeks = weeks.weeks.map((week) => {
        if (position === 'before' && week.week_number >= weekNumberInt) {
          return {
            ...week,
            week_number: week.week_number + 1,
          };
        } else if (position === 'after' && week.week_number > weekNumberInt) {
          return {
            ...week,
            week_number: week.week_number + 1,
          };
        }
        return week;
      });
  
      const newWeekData = {
        id: weeks.weeks.length + 1,
        week_number: weekNumberInt,
        modules,
      };
  
      if (position === 'before') {
        updatedWeeks.splice(weekNumberInt - 1, 0, newWeekData);
      } else if (position === 'after') {
        updatedWeeks.splice(weekNumberInt, 0, newWeekData);
      }
  
      setWeeks({ weeks: updatedWeeks });
      setNewWeek({ week_number: '', modules: [], position: 'before' });
      setShowModal(false);
    } else {
      toast('Please enter a valid week number greater than zero.');
    }
  };

  const handleWeekClick = (weekId) => {
    setActiveWeek(weekId);
  };

  // Update the newWeek state when the textarea input changes
  const handleModulesChange = (e) => {
    const modulesInput = e.target.value;
    const modulesArray = modulesInput.split('\n').map((module, index) => ({
      id: `mod${index + 1}`,
      name: module.trim(),
    }));
    setNewWeek({ ...newWeek, modules: modulesArray });
  };

  useEffect(() => {
    console.log('Updated Weeks JSON:', weeks);
  }, [weeks]);

  return (
    <>
      <div className="px-10">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <ul className="menu menu-horizontal px-1">
              {weeks.weeks.map((week) => (
                <li
                  key={week.id}
                  onClick={() => handleWeekClick(week.id)}
                  className={`cursor-pointer p-2 ml-5 rounded-md ${
                    activeWeek === week.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  Week {week.week_number}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-none">
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleAddWeek('before')}
            >
              Add a Week Before
            </button>
            <button
              className="mt-4 ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleAddWeek('after')}
            >
              Add a Week After
            </button>
          </div>
        </div>
        <main className="w-3/4 p-4 mt-10">
          {weeks.weeks.map((week) => (
            <div key={week.id} className={`mb-4 ${activeWeek !== week.id ? 'hidden' : ''}`}>
              <h3 className="text-xl font-bold mb-2">Week {week.week_number}</h3>
              {Object.values(week.modules).map((module) => (
                <div key={module.id} className="mb-2 bg-white p-4 border rounded-md">
                  <p className="font-bold">{module.name}</p>
                  {module.tasks &&
                    Object.values(module.tasks).map((task) => (
                      <p key={task.id} className="ml-4">
                        {task.name}
                      </p>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </main>
        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Add a New Week</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="week_number" className="block font-bold mb-2">
                    Week Number:
                  </label>
                  <input
                    type="number"
                    id="week_number"
                    className="border rounded-md p-2 w-full"
                    value={newWeek.week_number}
                    onChange={(e) => setNewWeek({ ...newWeek, week_number: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="modules" className="block font-bold mb-2">
                    Modules:
                  </label>
                  <textarea
                    id="modules"
                    rows="3"
                    className="border rounded-md p-2 w-full"
                    value={newWeek.modules.map((module) => module.name).join('\n')}
                    onChange={handleModulesChange}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleWeekSubmit}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-center" />
    </>
  );
};

export default Another;
