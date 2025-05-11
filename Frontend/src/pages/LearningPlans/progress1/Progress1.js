import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function ProgressWithGraphs() {
    const { currentUser } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPlan, setNewPlan] = useState({ title: '', description: '' });
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const fetchLearningPlans = async () => {
            if (!currentUser?.token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    'http://localhost:8089/api/v1/learning-plans/my-learning-plans',
                    {
                        headers: {
                            Authorization: `Bearer ${currentUser.token}`,
                        },
                    }
                );
                setPlans(response.data);
            } catch (error) {
                console.error('Error fetching learning plans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLearningPlans();
    }, [currentUser]);

    const addLearningPlan = async (e) => {
        e.preventDefault();
        if (!newPlan.title) return;

        try {
            const response = await axios.post(
                'http://localhost:8089/api/v1/learning-plans/my-learning-plans',
                newPlan,
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );
            setPlans((prevPlans) => [...prevPlans, response.data]);
            setNewPlan({ title: '', description: '' });
        } catch (error) {
            console.error('Failed to add learning plan:', error);
        }
    };

    const getMilestonesByStatus = (status) =>
        plans.flatMap((plan) => plan.milestones || []).filter((m) => m.status === status);

    const getProgress = (status) => {
        const total = plans.flatMap((plan) => plan.milestones || []).length;
        const count = getMilestonesByStatus(status).length;
        return total === 0 ? 0 : Math.round((count / total) * 100);
    };

    const filterDueTasks = () => {
        const today = moment();
        const realDue = plans.flatMap(plan =>
            (plan.milestones || []).filter(m => moment(m.deadline).isBefore(today))
        );
        const dummyDue = [
            { id: 'd1', title: 'Overdue A', deadline: '2024-05-01', status: 'in-progress' },
            { id: 'd2', title: ' Overdue B', deadline: '2024-05-02', status: 'to-be-started' }
        ];
        return [...realDue, ...dummyDue];
    };

    const weeklyData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Weekly Tasks',
            data: [12, 19, 3, 5, 2, 3, 7],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    const monthlyData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Monthly Tasks',
            data: [40, 30, 20, 50],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
        }],
    };

    return (
        <div className="container">
            <h2>Your Learning Plans</h2>
            <div className="btn btn-primary">Add plane</div>

            <div className="row mb-4">
                <div style={{ width: 80, height: 100, margin: '10px auto', marginLeft: "100px" }}>
                    <CircularProgressbar
                        value={getProgress('to-be-started')}
                        text={`${getProgress('to-be-started')}%`}
                        styles={buildStyles({ pathColor: 'orange' })}
                 

                    />
                               <div className="cicularText">To be done</div>
                </div>

                <div style={{ width: 80, height: 100, margin: '10px auto' }}>
                    <CircularProgressbar
                        value={getProgress('to-be-started')}
                        text={`${getProgress('to-be-started')}%`}
                        styles={buildStyles({ pathColor: 'orange' })}
                    />
                </div>
                <div style={{ width: 80, height: 80, margin: '10px auto' }}>
                    <CircularProgressbar
                        value={getProgress('to-be-started')}
                        text={`${getProgress('to-be-started')}100%`}
                        styles={buildStyles({ pathColor: 'orange' })}
                    /><div className="cicularText">To be done</div>
                </div>


                <div className="mt-4">
                    <h3>Due Tasks</h3>
                    <div className="card bg-warning text-dark p-3">
                        {filterDueTasks().map((m) => (
                            <p key={m.id}>
                                <strong>{m.title}</strong> — Missed Deadline: {m.deadline}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-md-6">
                        <h4>Weekly Tasks Overview</h4>
                        <Bar data={weeklyData} />
                    </div>
                    <div className="col-md-6">
                        <h4>Monthly Tasks Overview</h4>
                        <Bar data={monthlyData} />
                    </div>
                </div>

                <div className="mt-5" style={{ marginLeft: "500px", marginTop: "-1350px" }}>Ffumm
                    <h4>Calendar</h4>
                    <Calendar onChange={setDate} value={date} />
                </div>
            </div></div>
    );
}
<div className="cicularText">To be done</div>
export default ProgressWithGraphs;
