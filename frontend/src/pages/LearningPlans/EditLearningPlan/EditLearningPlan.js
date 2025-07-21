import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsPen } from "react-icons/bs";
import { BsCalendar3 } from 'react-icons/bs';
import { BsBook } from 'react-icons/bs'
import { BsBagPlus } from 'react-icons/bs';
import { BsClipboard2Data } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useNavigate, useParams } from 'react-router-dom';
import './EditLearningPlan.css';
function EditLearningPlan() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [milestones, setMilestones] = useState([])
    const [errors, setErrors] = useState({})
    const [plan, setPlan] = useState({
        title: '',

        description: '', topic: '', resources: '', timelineStart: '', timelineEnd: '', milestones: '', errors: ''

    })


    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const res = await axios.get(`http://localhost:8089/api/learn-track/${id}`);
                const fetched = res.data;
                setPlan({
                    title: fetched.title,
                    topic: Array.isArray(fetched.topics) ? fetched.topics[0] : '',

                    description: fetched.description, resources: fetched.resources.join(','), timelineStart: fetched.timelineStart, timelineEnd: fetched.timelineEnd,
                });
                setMilestones(fetched.milestones || []);

            } catch (err) {

                console.error('error fetching plans', err)
            }
        }
        fetchPlan();

    }, [id])
    const handleMilestoneChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...milestones];
        updated[index][name] = value;
        setMilestones(updated);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlan(prev => ({ ...prev, [name]: value }))
    }
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedPlan = {
                ...plan,
                resources: plan.resources.split(',').map(item => item.trim()),
                milestones,

            };
            await axios.put(`http://localhost:8089/api/learn-track/${id}`, updatedPlan);
            alert('plan updated')
        } catch (err) {
            console.log("update error", err)
        }
    }



    const handleAddMilestone = () => {
        setMilestones(prev => [...prev, { milestone: '', deadline: '', status: '' }])
    }
    const handleRemoveMilestone = (index) => {
        if (milestones.length > 1) {
            setMilestones(milestones.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="editLearningPlan" style={{ backgroundImage: "url('/images/addbackground.jpg')" }}>
            <div className="container">
                <form onSubmit={handleUpdateSubmit}>
                    <p>Edit Learning Plan</p>

                    {/* Title */}
                    <div className="row">
                        <div className="col-md-4 p-2">
                            <label className="form-label" style={{ marginRight: "20px" }}>Title</label> <BsPen />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Title"
                                value={plan.title}
                                onChange={handleChange}
                            />
                            {errors.title && <p className="error">{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div className="col-md-4 p-2">
                            <label className="form-label" style={{ marginRight: "20px" }}>Description</label>
                            <BsPen />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Description"
                                value={plan.description}
                                onChange={handleChange}
                            />
                            {errors.description && <p className="error">{errors.description}</p>}
                        </div>
                    </div>

                    {/* Topic */}
                    <div className="row">
                        <div className="col-md-4 p-2">
                            <label className="form-label" style={{ marginRight: "20px" }}>Topic</label><BsPen />
                            <input
                                type="text"
                                className="form-control"
                                value={plan.topic}
                                onChange={handleChange}
                            />
                            {errors.topic && <p className="error">{errors.topic}</p>}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="row">
                        <div className="col-md-4 p-2">
                            <label className="form-label" style={{ marginRight: "20px" }}>Timeline Start</label><BsCalendar3 />
                            <input
                                type="date"
                                className="form-control"
                                value={plan.timelineStart}
                                onChange={handleChange}
                            />
                            {errors.timelineStart && <p className="error">{errors.timelineStart}</p>}
                        </div>

                        <div className="col-md-4 p-2">
                            <label className="form-label" style={{ marginRight: "20px" }}>Timeline End</label><BsCalendar3 />
                            <input
                                type="date"
                                className="form-control"
                                value={plan.timelineEnd}
                                onChange={handleChange}
                            />
                            {errors.timelineEnd && <p className="error">{errors.timelineEnd}</p>}
                        </div>
                    </div>

                    {/* Milestones */}
                    <div className="row" >
                        <div className="col-md-4 p-2">
                            {milestones.map((milestone, index) => (
                                <div key={index} className="milestone" style={{ marginBottom: "20px " }}>
                                    <label style={{ marginRight: "30px" }}>
                                        Milestone {index + 1}:<BsBagPlus />
                                        <input
                                            type="text"
                                            name="milestone"
                                            value={milestone.name}
                                            onChange={handleMilestoneChange}

                                        />
                                    </label>
                                    {errors[`milestone_${index}`] && (
                                        <p className="error">{errors[`milestone_${index}`]}</p>
                                    )}

                                    <div className="date" style={{ display: 'flex', marginTop: '-48px', marginLeft: '250px' }}>
                                        <label>
                                            Deadline: <BsCalendar3 />
                                            <input
                                                type="date"
                                                name="deadline"
                                                value={milestone.deadline}
                                                onChange={(e) => handleMilestoneChange(index, e)}
                                            />
                                        </label>
                                        {errors[`deadline_${index}`] && (
                                            <p className="error">{errors[`deadline_${index}`]}</p>
                                        )}
                                    </div>

                                    <div className="milestone-status" style={{ display: 'flex', marginTop: '-35px', marginLeft: '450px', width: '200px' }}>
                                        <label style={{ display: 'flex', marginTop: '-16px' }}>Status:<BsClipboard2Data /> </label>
                                        <select name="status" style={{ marginTop: '06px' }} value={milestone.status} onChange={(e) => handleMilestoneChange(index, e)} className="form-select">
                                            <option value="">Select status</option>
                                            <option value="InProgress">In progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="ToBeStarted">To Be Started</option>
                                        </select>
                                    </div>



                                    <div className="btns" style={{ display: 'flex', marginTop: '-40px', marginLeft: '650px', width: "150px" }}>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => handleRemoveMilestone(index)}
                                            disabled={milestones.length <= 1}
                                        >
                                            <RiDeleteBin3Line />

                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="btn2" style={{ display: 'flex', marginTop: '-60px', marginLeft: '600px', width: "300px" }}>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAddMilestone}
                                    disabled={milestones.length >= 5}
                                >
                                    <IoMdAdd />
                                </button>
                            </div>
                        </div>
                    </div >
                    {/* Resources */}
                    < div className="row" >
                        <div className="col-md-4 p-2">
                            <label className="form-label" style={{ marginRight: "20px" }}>Resources</label><BsBook />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Comma-separated links"
                                value={plan.resources}
                                onChange={handleChange}
                            />
                            {errors.resources && <p className="error">{errors.resources}</p>}
                        </div>
                    </div >

                    {/* Submit Button */}
                    < div className="btn" >
                        <button type="submit" className="btn btn-success">Submit</button>
                    </div >
                </form >
            </div >
        </div >
    )
}

export default EditLearningPlan
