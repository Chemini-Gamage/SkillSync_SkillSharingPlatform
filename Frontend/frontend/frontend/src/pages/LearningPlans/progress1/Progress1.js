import React, { useState, useEffect } from 'react';

import './progress1.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-circular-progressbar/dist/styles.css';
import api from '../../../services/api';

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
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthylyData, setMonthlyData] = useState([]);
    const [milestones, setMilestones] = useState([]);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const [weeklyRes, monthlyRes, plansRes] = await Promise.all([
                api.get('/api/stats/weekly'),
                api.get('/api/stats/monthly'),
                api.get('/api/learn-track'),
            ]);
            setWeeklyData(weeklyRes.data);
            setMonthlyData(monthlyRes.data);
            setPlans(plansRes.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const normalizeStatus = (status) =>
        status?.trim().toLowerCase().replace(/\s+/g, '');

    const groupedMilestones = {
        tobestarted: [],
        inprogress: [],
        completed: [],
    };

    plans.forEach((plan) => {
        (plan.milestones || []).forEach((milestone) => {
            const normalized = normalizeStatus(milestone.status || 'ToBeStarted');
            if (groupedMilestones[normalized]) {
                groupedMilestones[normalized].push({
                    ...milestone,
                    planTitle: plan.title,
                    planTopic: plan.topic,
                    planId: plan._id,
                });
            }
        });
    });
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip bg-light p-2 border rounded shadow-sm">
                    <p className="mb-1"><strong>{`Label: ${label}`}</strong></p>
                    <p className="mb-0">{`Tasks: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    const isDeadlineNear = (deadline) => {
        if (!deadline) return false;
        const today = moment();
        const dueDate = moment(deadline);
        const diff = dueDate.diff(today, 'days');
        return diff >= 0 && diff <= 2;
    };

    const taskWithReminders = plans.flatMap((plan) =>
        (plan.milestones || [])
            .filter((milestone) => isDeadlineNear(milestone.deadline))
            .map((milestone) => ({ ...milestone, planTitle: plan.title }))
    );

    const handleDateClick = (date) => {
        onAddPlan(date);
    };

    const titleClassName = ({ date, view }) => {
        if (view === 'month' && markedDates.includes(date.toDateString())) {
            return 'marked-date';
        }
    };

    const markedDates = plans.map((plan) =>
        new Date(plan.deadline).toDateString()
    );

    const calculateProgressForPlan = (plan) => {
        const milestones = plan.milestones || [];
        if (milestones.length === 0) return 0;
        const completed = milestones.filter(
            (m) => normalizeStatus(m.status) === 'completed'
        ).length;
        return Math.round((completed / milestones.length) * 100);
    };

    const handleMarkAsInProgress = async (id) => {
        try {
            await api.put(`/api/milestone/${id}/inprogress`);
            fetchPlans();
        } catch (err) {
            console.error('Failed to mark as in progress:', err);
        }
    };

    const handleMarkAsCompleted = async (id) => {
        try {
            await api.put(`/api/milestone/${id}/complete`);
            fetchPlans();
        } catch (err) {
            console.error('Failed to mark as completed:', err);
        }
    };

    const filterData = (milestones, searchKey) => {
        const filtered = milestones.filter((m) =>
            m.name.toLowerCase().startsWith(searchKey.toLowerCase())
        );
        setMilestones(filtered);
    };


    const handleSearchArea = async (e) => {
        const searchKey = e.currentTarget.value;
        try {
            const res = await api.get('/api/learn-track');
            filterData(res.data, searchKey);
        } catch (err) {
            console.error('Search failed:', err);
        }
    };
    document.addEventListener("DOMContentLoaded", () => {
        fetch('/api/v1/authentication/users/me')
            .then(response => response.json())
            .then(user => {
                const greetingElement = document.getElementById('greeting');
                if (greetingElement) {
                    greetingElement.innerHTML = `<h5>HI !${user.username}</h5>`;
                }
            })
            .catch(() => {
                const greetingElement = document.getElementById('greeting');
                if (greetingElement) {
                    greetingElement.innerHTML = '<h5>HI !Guest</h5>';
                }
            });
    });


    return (

        <div className="container">
            <div className="progress-full-wrapper mt-3 px-4">

                <h2 className="mb-4">
                    Learning Plans <FcTodoList size={28} />
                    <div id="greeting"></div>

                </h2>
                <div className="search-bar">
                    <input type="text" onChange={handleSearchArea} placeholder='Search by  milestones name' />
                    <button >search</button>
                </div>
                <div className="addLP">
                    <a href="/learningPlans/add"
                     className="btn btn-primary">AddLearning Plan</a>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">

                        <div className="card w-40">
                            <div className="card-title text-center mt-2">Weekly Statistics</div>
                            <div className="card-body">
                                <BarChart width={300} height={200} data={weeklyData}>
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

                    <div className="col-md-4 mb-3">

                        <div className="card w-40">
                            <div className="card-title text-center mt-2">Monthly Statistics</div>
                            <div className="card-body">
                                <LineChart width={300} height={200} data={monthylyData}>
                                    <CartesianGrid strokeDasharray="2 2" />
                                    <XAxis dataKey="label" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="tasks" stroke="#8884d8" strokeWidth={2} />
                                </LineChart>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4 d-flex " >

                        <div className="card-due"
                            style={{
                                width: "100%", maxWidth: "250px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                            }}>
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
                                                    onClick={() => handleMarkAsCompleted
                                                        (task)}
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

                    {/* <LearningPlanCalender plans={plans} onAddPlan={handleDateClick}
                    /> */}

                    <div className="row mt-0">

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
        </div>
    );
}

export default Progress1;

