import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewAllPlans() {
    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get('http://localhost:8089/api/learn-track');
                ;
                setPlans(response.data);
                console.log('data fetched', JSON.stringify(response.data, null, 2))
            } catch (error) {
                console.error('Error fetching plans:', error);
            }
        };

        fetchPlans();
    }, []);
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8089/api/learn-track/${id}`);
            setPlans(plans.filter(plan => plan.id != id));
            alert("deleted");

        } catch (error) {
            alert(error)
        }
    }
    const editByID = (id) => {
        navigate(`/learning_plan/edit/${id}`);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">All Learning Plans</h2>
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Title</th>
                        <th>Topic</th>
                        <th>Description</th>
                        <th>Timeline</th>
                        <th># of Milestones</th>
                        <th>Resources</th>
                        <th>Milestones</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {plans && plans.map((plan, index) => (
                        plan.milestones.length > 0 ? (
                            plan.milestones.map((milestone, mIndex) => (
                                <tr key={`${index}-${mIndex}`}>
                                    {/* Only show plan-level data on the first milestone row */}
                                    {mIndex === 0 && (
                                        <>
                                            <td rowSpan={plan.milestones.length}>{plan.title}</td>
                                            <td rowSpan={plan.milestones.length}>
                                                {plan.topics && plan.topics.length > 0 ? plan.topics.join(', ') : 'No topics available'}
                                            </td>

                                            <td rowSpan={plan.milestones.length}>{plan.description}</td>
                                            <td rowSpan={plan.milestones.length}>{plan.timelineStart} → {plan.timelineEnd}</td>
                                            <td rowSpan={plan.milestones.length}>{plan.milestones.length}</td>
                                            <td rowSpan={plan.milestones.length}>
                                                <ul>
                                                    {plan.resources.map((res, i) => (
                                                        <li key={i}><a href={res} target="_blank" rel="noopener noreferrer">{res}</a></li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </>
                                    )}

                                    {/* Milestone-specific cells */}
                                    <td>{milestone.name}</td>
                                    <td>
                                        <span className={`badge ${milestone.status === "Completed" ? "bg-success" :
                                            milestone.status === "In Progress" ? "bg-warning text-dark" :
                                                "bg-secondary"
                                            }`}>
                                            {milestone.status}
                                        </span>
                                    </td>

                                    {/* Only show action buttons once per plan */}
                                    {mIndex === 0 && (
                                        <td rowSpan={plan.milestones.length}>
                                            <button onClick={() => handleDelete(plan.id)}>Delete</button>
                                            <button onClick={() => editByID(plan.id)}>Edit</button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr key={index}>
                                <td>{plan.title}</td>
                                <td>{plan.topics?.join(', ')}</td>
                                <td>{plan.description}</td>
                                <td>{plan.timelineStart} → {plan.timelineEnd}</td>
                                <td>0</td>
                                <td>
                                    <ul>
                                        {plan.resources.map((res, i) => (
                                            <li key={i}><a href={res} target="_blank" rel="noopener noreferrer">{res}</a></li>
                                        ))}
                                    </ul>
                                </td>
                                <td colSpan={2}>No milestones</td>
                                <td>
                                    <button onClick={() => handleDelete(plan.id)}>Delete</button>
                                    <button onClick={() => editByID(plan.id)}>Edit</button>
                                </td>
                            </tr>
                        )
                    ))}
                </tbody>

            </table>
        </div>
    );
}

export default ViewAllPlans;
