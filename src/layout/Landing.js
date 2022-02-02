import React, { useState, useEffect } from 'react';
import AddGpa from '../components/dashboard/AddGpa';
import '../components/dashboard/dash.css';

function Landing() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const [commulativeGpa, setCommulativeGpa] = useState(null);

  useEffect(() => {
    getAllResults();
  }, [])

  const getAllResults = () => {
    localStorage.getItem('@allResults') && setAllResults(JSON.parse(localStorage.getItem('@allResults')));
  }

  const addResultHandler = (result) => {
    console.log(result);
    setAllResults([...allResults, result]);
    localStorage.setItem('@allResults', JSON.stringify([...allResults, result]));
  };

  const calculateTotalGpa = () => {
    let total = 0;
    allResults.map((result) => {
      total += parseFloat(result.score);
      return null;
    });
    console.log(total, allResults?.length);
    setCommulativeGpa(total / allResults?.length);
  };

  const onDelete = (index) => {
    const updated = allResults.filter((result, i) => i !== index);
    setAllResults(updated);
    localStorage.setItem('@allResults', JSON.stringify(updated));
  }

  return (
    <div className='dashboard'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12 col-lg-12 '>
            <h1 className='display-9'>GPA Dashboard</h1>
          </div>
          <button
            className='btn btn-danger mt-4'
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Add a course
          </button>
        </div>
        {showAddForm && (
          <div>
            <AddGpa
              allResults={allResults}
              onAddResult={addResultHandler}
              calculateTotalGpa={calculateTotalGpa}
            />
          </div>
        )}

        <div className='list_cont'>
          {commulativeGpa && (
            <h3>CGPA: {Number(commulativeGpa)?.toFixed(2)}</h3>
          )}
          {!!allResults?.length && (
            <button
              className='btn btn-danger mt-4'
              onClick={() => {
                setAllResults([]);
                localStorage.removeItem('@allResults');
              }}
            >
              Clear
            </button>
          )}
          {allResults?.map((r, i) => (
            <div className='note' key={i}>
              <div className='left'>
                <div className='title'>
                  Sem: {r?.semester} / {r?.year}
                </div>
                <div className='desc'>
                  {r?.subject?.code} {r?.subject?.name}
                </div>
              </div>
              <div className='right'>
                <span className='title'>Gpa: {r?.score}</span>
                <button
                  className='btn btn-danger '
                  onClick={() => onDelete(i)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Landing;
