import React, { useState, useEffect } from 'react';
import AddGpa from '../components/dashboard/AddGpa';
import '../components/dashboard/dash.css';
import { grades } from '../utils/gradeList';

function Landing() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const [commulativeGpa, setCommulativeGpa] = useState(null);

  useEffect(() => {
    getAllResults();
  }, []);

  const getAllResults = () => {
    localStorage.getItem('@allResults') &&
      setAllResults(JSON.parse(localStorage.getItem('@allResults')));
  };

  const addResultHandler = (result) => {
    console.log(result);
    setAllResults([
      ...allResults,
      {
        ...result,
        courseYear: `${result?.semester}/${result?.year}`,
        id: Math.random(),
      },
    ]);
    localStorage.setItem(
      '@allResults',
      JSON.stringify([
        ...allResults,
        {
          ...result,
          courseYear: `${result?.semester}/${result?.year}`,
          id: Math.random(),
        },
      ])
    );
  };

  const calculateTotalGpa = () => {
    let total = 0;
    let totalSem = 0;
    allResults.map((result) => {
      if (result?.score === '0') {
        total += 0;
        totalSem++;
      }
      if (parseFloat(result.score)) {
        total += parseFloat(result.score);
        totalSem++;
      }
      // total += parseFloat(result?.score !== '' ? result?.score : 0);
      return null;
    });
    console.log(total, allResults?.length);
    setCommulativeGpa(total / totalSem);
  };

  const onDelete = (id) => {
    const updated = allResults.filter((result, i) => result?.id !== id);
    setAllResults(updated);
    localStorage.setItem('@allResults', JSON.stringify(updated));
  };

  const groups = allResults?.reduce((groups, r) => {
    const date = r.courseYear;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(r);
    return groups;
  }, {});

  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(groups).map((date) => {
    return {
      date,
      courses: groups[date],
    };
  });

  console.log(groupArrays);

  const calculateScore = (arr) => {
    let total = 0;
    let totalSubjects = 0;
    console.log(arr);
    arr.map((result) => {
      // total += parseFloat(result?.score !== '' ? result.score : 0);
      if (result?.score === '0') {
        total += 0;
        totalSubjects++;
      }
        if (parseFloat(result.score)) {
          total += parseFloat(result.score);
          totalSubjects++;
        }
      return null;
    });

    return (total / totalSubjects)?.toFixed(2);
  };

  const getGrade = (score) => {
    if(score === '0') {
      return 'F';
    }
    if (parseFloat(score)) {
      const u = grades.filter((g) => g.value === parseFloat(score));
      console.log(u);
      if (u?.[0]) {
        console.log(u);
        return u[0].label;
      }
      return '';
    } else {
      const u = grades.filter((g) => g.value === score);
      console.log(u);
      if (u?.[0]) {
        console.log(u);
        return u[0].label;
      }
      return '';
    }
  };

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
                setCommulativeGpa(null);
              }}
            >
              Clear
            </button>
          )}
          {console.log(allResults)}
          {groupArrays?.map((group, i) => {
            return (
              <div
                key={i}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <h6>
                  {group.date} GPA: {calculateScore(group.courses)}
                </h6>
                {group.courses.map((r, j) => {
                  return (
                    <div className='note' key={j}>
                      <div className='left'>
                        <div className='title'>
                          Sem: {r?.semester} / {r?.year}
                        </div>
                        <div className='desc'>
                          {j + 1}) {r?.subject?.code} {r?.subject?.name}
                        </div>
                      </div>
                      <div className='right'>
                        <span className=''>
                          Gpa: {r?.score} Grade: {getGrade(r?.score)}
                        </span>
                        <button
                          className='btn btn-danger '
                          onClick={() => onDelete(r?.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* {allResults?.map((r, i) => (
            <div className='note' key={i}>
              <div className='left'>
                <div className='title'>
                  Sem: {r?.semester} / {r?.year}
                </div>
                <div className='desc'>
                  {i + 1}) {r?.subject?.code} {r?.subject?.name}
                </div>
              </div>
              <div className='right'>
                <span className='title'>Gpa: {r?.score}</span>
                <button className='btn btn-danger ' onClick={() => onDelete(i)}>
                  Remove
                </button>
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
}

export default Landing;
