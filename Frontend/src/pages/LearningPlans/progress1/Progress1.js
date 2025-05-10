import React, { useState, useEffect } from 'react';

import './progress1.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-circular-progressbar/dist/styles.css';

import axios from 'axios';
import { Card, CardBody, Spinner } from 'react-bootstrap';
import { FcTodoList, FcOk, FcAdvance } from 'react-icons/fc';
import { FaHourglassHalf } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart, Label } from 'recharts';

import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import LearningPlanCalender from '../../../components/Calender/LearningPlanCalender';

const localizer = momentLocalizer(moment);


function Progress1({ onAddPlan }) {
    const [plans, setPlans] = useState([]);
    //chart data from db
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthylyData, setMonthlyData] = useState([]);
    const [events, setEvents] = useState([

    ]);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const [weeklyRes, monthlyREs, plansRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/stats/weekly'),
                    axios.get('http://localhost:5000/api/stats/monthly'),
                    axios.get('http://localhost:5000/api/learn-track'),

                ]);
                setMonthlyData(monthlyREs.data);
                setWeeklyData(weeklyRes.data);
                setPlans(plansRes.data);
            } catch (error) {
                console.error('Error fetching plans:', error);
            }
        };

        fetchPlans();
    }, []);
    //to customize the tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`Month:${label}`}</p>
                    <p className="desc">{`Tasks: :${payload[0].value}`}</p>
                </div>
            )
        }
    }

    // Normalize status string
    const normalizeStatus = (status) => status?.trim().toLowerCase().replace(/\s+/g, '');

    // Update milestone status to completed
    const markAsCompleted = (task) => {
        const updatedPlans = plans.map(plan => {
            if (plan._id === task.planId) {
                const updatedMilestones = plan.milestones.map(m =>
                    m.name === task.name ? { ...m, status: 'Completed' } : m
                );
                return { ...plan, milestones: updatedMilestones };
            }
            return plan;
        });
        setPlans(updatedPlans);
    };
    //handleASInprogress
    const handleMarkAsinprogress = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/milestone/${id}/inprogress`, {
                method: 'PUT',
            });

            if (response.ok) {
                console.log("Milestone marked as inprogress");
                window.location.reload()
            } else {
                console.error("Failed to mark as inprogress", response.text());
            }
        } catch (err) {
            console.log("ERROR", err);
        }
    };
    //handleMrksasCompleted
    const handleMarkAsCompleted = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/milestone/${id}/complete`, {
                method: 'PUT',
            });

            if (response.ok) {
                console.log("Milestone marked as completed");
                window.location.reload()
            } else {
                console.error("Failed to mark as completed", response.text());
            }
        } catch (err) {
            console.log("ERROR", err);
        }
    };


    // Sample charts data
    // const data1 = [
    //     { name: 'Mon', tasks: 2 },
    //     { name: 'Tue', tasks: 3 },
    //     { name: 'Wed', tasks: 5 },
    // ];

    // const data2 = [
    //     { day: 'Jan', tasks: 2 },
    //     { day: 'Feb', tasks: 3 },
    //     { day: 'March', tasks: 5 },
    //     { day: 'April', tasks: 8 },
    // ];
    // Group milestones
    const groupedMilestones = {
        tobestarted: [],
        inprogress: [],
        completed: [],
    };

    plans.forEach(plan => {
        (plan.milestones || []).forEach(milestone => {
            const normalized = normalizeStatus(milestone.status || 'ToBeStarted');
            if (groupedMilestones[normalized]) {
                groupedMilestones[normalized].push({
                    ...milestone,
                    planTitle: plan.title,
                    planTopic: plan.topic,
                    planId: plan._id
                });
            }
        });
    });
    //reminder
    const isDeadlineNear = (deadline) => {
        if (!deadline) return false;
        const today = moment();
        const dueDate = moment(deadline);
        const diff = dueDate.diff(today, 'days');
        return diff >= 0 && diff <= 2;
    };
    //tasks to the reminder card
    const taskWithReminders = plans.flatMap(plan =>
        (plan.milestones || []).filter(milestone => isDeadlineNear(milestone.deadline)).map(milestone => ({
            ...milestone,
            planTitle: plan.title,
        }))
    );


    //calender with markedDates
    const markedDates = plans.map(plan => new Date(plan.deadline).toDateString());
    const handleDateClick = (date) => {
        ('Do you want to add a learning plan?? ${date.toDateString()?}')
        onAddPlan(date);
    }
    const titleClassName = ({ date, view }) => {
        if (view === "month" && markedDates.includes(date.toDateString)) {
            return "marked-date"
        }
    }


    //calculate progress

    const calculateProgressForPlan = (plan) => {
        const milestones = plan.milestones || [];
        if (milestones.length === 0) return 0;

        const completed = milestones.filter(m => normalizeStatus(m.status) === 'completed').length;
        console.log("milestone length", milestones.length)
        return Math.round((completed / milestones.length) * 100);
    };

    const fetchPlans = async () => {
        try {
            const [weeklyRes, monthlyREs, plansRes] = await Promise.all([
                axios.get('http://localhost:5000/api/stats/weekly'),
                axios.get('http://localhost:5000/api/stats/monthly'),
                axios.get('http://localhost:5000/api/learn-track'),
            ]);
            setMonthlyData(monthlyREs.data);
            setWeeklyData(weeklyRes.data);
            setPlans(plansRes.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    useEffect(() => {
        fetchPlans(); // you can also rename this to fetchMilestones if preferred
    }, []);
    //search 
    const [milestones, setMilestones] = useState([])

    const filterData = (milestones, searchkey) => {
        const result4 = milestones.filter((milestones) =>
            milestones.name.toLowerCase().slice(0, 4).includes(searchkey.toLowerCase()));
        setMilestones(result4)
    };
    const handleSearchArea = (e) => {
        const searchkey = e.currentTarget.value;
        axios.get(`http://localhost:5000/api/learn-track`, {

        }).then((res) => {
            filterData(res.data, searchkey);
            console.log(res.data)

        }).catch((err) => {
            console.log(err);

        })
    }

    return (

        <div className="progress-full-wrapper mt-3 px-4">

            <h2 className="mb-4">
                Learning Plans <FcTodoList size={28} />
                <h5>HI !Jane</h5>
            </h2>
            <input type="text" onChange={handleSearchArea} placeholder='Search by  milestones name' />
            <button >search</button>

            <div className="addLP">
                <a href="/learning_plan/add" className="btn btn-primary">AddLearning Plan</a>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3  " style={{ marginLeft: "-20px" }}>
                    <div className="card w-50">
                        <div className="card-title text-center mt-2">Weekly Statistics</div>
                        <div className="card-body">
                            <BarChart width={400} height={200} data={weeklyData}>
                                <CartesianGrid strokeDasharray="2 2" />
                                <XAxis dataKey="label">
                                    <Label value="Days of the week" offset={-5} position="insideBottom" /></XAxis>
                                <YAxis> <Label value="values" offset={-5} position="insideLeft" /></YAxis>
                                <Tooltip content={<CustomTooltip />} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="tasks" fill="#8884d8" />
                            </BarChart>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-3" style={{ marginLeft: "-440px" }}>
                    <div className="card w-50">
                        <div className="card-title text-center mt-2">Monthly Statistics</div>
                        <div className="card-body">
                            <LineChart width={400} height={200} data={monthylyData}>
                                <CartesianGrid strokeDasharray="2 2" />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="tasks" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4 d-flex justify-content-end">
                    <div className="card" style={{ width: "100%", maxWidth: "350px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
                        <div className="card-header text-center text-white bg-danger fw-bold">
                            ⚠️ Due Soon
                        </div>
                        <div className="card-body">
                            {taskWithReminders.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {taskWithReminders.map((task, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{task.title || "Untitled Task"}</strong>
                                                <br />
                                                <small className="text-muted">
                                                    Due: {new Date(task.deadline).toLocaleDateString()}
                                                </small>
                                            </div>
                                            <button
                                                className="btn btn-sm btn-outline-success"
                                                onClick={() => markAsCompleted(task)}
                                            >
                                                Done
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center text-muted">No upcoming deadlines</div>
                            )}
                        </div>
                    </div>
                </div>

                <LearningPlanCalender plans={plans} onAddPlan={handleDateClick}
                />
                {/* <div className="calender">
                <div className="col">
                    <div class="card" style={{ width: "18rem" }}>
                        <div class="card-body">
                            <h5 class="card-title">Calender</h5>

                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 450 }}
                                onClickDay={handleDateClick}
                                titleClassName={titleClassName} />

                        </div>
                    </div>
                </div>
            </div> */}
                <div className="row mt-4">


                    {/* To Be Started */}
                    <div className="col-md-4">
                        <h4 className="text-center text-warning">To Be Started</h4>
                        {groupedMilestones.tobestarted.length === 0 ? (
                            <Card>
                                <div className="text-center text-muted mt-2" style={{ fontSize: "20px", fontWeight: "bold" }}
                                >
                                    No plans yet</div>
                            </Card>
                        )
                            : (
                                groupedMilestones.tobestarted.map((milestone,
                                    index) => {
                                    const progress = milestone.status?.toLowerCase() === 'completed' ? 100 : 0;
                                    return (
                                        <Card key={index} className="mb-4 shadow-sm">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <Card.Title>{milestone.name}</Card.Title>

                                                        <Card.Subtitle className="mb-2 text-muted">{milestone.planTitle}</Card.Subtitle>
                                                        <div className="mt-3" style={{ width: 80 }}>
                                                            <CircularProgressbar
                                                                value={progress}
                                                                text={`${progress}%`}
                                                                styles={buildStyles({
                                                                    pathColor: progress === 100 ? "#28a745" : "#007bff",
                                                                    textColor: "#000",
                                                                    trailColor: "#eee",
                                                                })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="ms-3">

                                                        <div>Deadline: {milestone.deadline
                                                        }</div>
                                                        <button className="btn btn-sm btn-outline-warning mt-2" onClick={() => handleMarkAsinprogress(milestone.id)} >

                                                            {/* onChange={() => handleMarkAsCompleted(milestone.id)} */}

                                                            Start Now <FcAdvance />
                                                        </button>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    );
                                }))}
                    </div>


                    {/* Completed */}
                    <div className="col-md-4">
                        <h4 className="text-center text-secondary
                        ">Completed </h4>{
                            groupedMilestones.completed.length === 0 ? (
                                <Card>
                                    <div className="text-center text-muted mt-2" style={{ fontSize: "20px", fontWeight: "bold" }}
                                    >
                                        No plans yet</div>
                                </Card>
                            ) : (

                                groupedMilestones.completed.map((milestone,
                                    index) => {

                                    const progress = milestone.status?.toLowerCase() === 'completed' ? 100 : 0;


                                    return (
                                        <Card key={index} className="mb-4 shadow-sm">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <Card.Title>{milestone.name}</Card.Title>

                                                        <Card.Subtitle className="mb-2 text-muted">{milestone.planTitle}</Card.Subtitle>
                                                        <div className="mt-3" style={{ width: 80 }}>
                                                            <CircularProgressbar
                                                                value={progress}
                                                                text={`${progress}%`}
                                                                styles={buildStyles({
                                                                    pathColor: progress === 100 ? "#28a745" : "#007bff",
                                                                    textColor: "#000",
                                                                    trailColor: "#eee",
                                                                })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="ms-3">

                                                        <div>Deadline: {milestone.deadline
                                                        }</div>

                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    );
                                }))}
                    </div>

                    {/*               
InProgress */}

                    <div className="col-md-4">
                        <h4 className="text-center text-primary
                        ">In Progress

                        </h4>
                        {
                            groupedMilestones.inprogress.length === 0 ? (
                                <Card>
                                    <div className="text-center text-muted mt-2" style={{ fontSize: "20px", fontWeight: "bold" }}
                                    >
                                        No plans yet</div>
                                </Card>
                            ) : (

                                groupedMilestones.inprogress.map((milestone,
                                    index) => {

                                    const fullPlan = plans.find(p => p._id === milestone.planId);
                                    const progress = calculateProgressForPlan(fullPlan);


                                    // console.log("Milestone:", milestone);
                                    // console.log("milestone.milestones:", milestone.milestones);

                                    return (
                                        <Card key={index} className="mb-4 shadow-sm">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <Card.Title>{milestone.name}</Card.Title>

                                                        <Card.Subtitle className="mb-2 text-muted">{milestone.planTitle}</Card.Subtitle>
                                                        <div className="mt-3" style={{ width: 80 }}>
                                                            <CircularProgressbar
                                                                value={progress}
                                                                text={`${progress}%`}
                                                                styles={buildStyles({
                                                                    pathColor: progress === 100 ? "#28a745" : "#007bff",
                                                                    textColor: "#000",
                                                                    trailColor: "#eee",
                                                                })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="ms-3">

                                                        <div>Deadline: {milestone.deadline
                                                        }</div>

                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`check-${index

                                                                    }`}
                                                                onChange={() => handleMarkAsCompleted(milestone.id)}
                                                            />
                                                            <label className="form-check-label" htmlFor={`check-${index
                                                                }`}>
                                                                Mark Complete
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-sm btn-outline-primary mt-2">
                                                        Proceed <FcAdvance />
                                                    </button>
                                                    {isDeadlineNear(milestone.deadline) && (
                                                        <div className="alert alert-danger
p-1 mt-2">Reminder</div>

                                                    )
                                                    }</div>

                                            </Card.Body>
                                        </Card>
                                    );
                                }))}
                    </div>

                </div></div></div>

    );
}

export default Progress1;

