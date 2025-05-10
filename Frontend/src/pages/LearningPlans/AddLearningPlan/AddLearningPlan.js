import React, { useState } from 'react';
import './AddLearningPlan.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsPen } from "react-icons/bs";
import { BsCalendar3 } from 'react-icons/bs';
import { BsBook } from 'react-icons/bs'
import { BsBagPlus } from 'react-icons/bs';
import { BsClipboard2Data } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBin3Line } from "react-icons/ri";


function AddLearningPlan() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [topic, setTopic] = useState('');
    const [resources, setResources] = useState('');
    const [timelineStart, setTimelineStart] = useState('');
    const [timelineEnd, setTimelineEnd] = useState('');
    const [milestones, setMilestones] = useState([{ name: '', deadline: '', status: '' }]);
    const [errors, setErrors] = useState({});

    // Handle Milestone Change
    const handleMilestoneChange = (index, event) => {
        const { name, value } = event.target;
        setMilestones((prevMilestones) => {
            const updatedMilestones = [...prevMilestones];
            updatedMilestones[index] = { ...updatedMilestones[index], [name]: value };
            return updatedMilestones;
        });
    };

    // Add New Milestone
    const handleAddMilestone = () => {
        if (milestones.length < 5) {
            setMilestones([...milestones, { name: '', deadline: '', status: '' }]);
        }
    };

    const handleRemoveMilestone = (index) => {
        if (milestones.length > 1) {
            setMilestones(milestones.filter((_, i) => i !== index));
        }
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const planData = {
            title,
            description,
            topic,
            timelineStart,
            timelineEnd,
            milestones,
            resources: resources.split(',').map((item) => item.trim()),
        };

        console.log('Submitting Data:', JSON.stringify(planData, null, 2));

        try {
            const response = await axios.post('http://localhost:5000/api/learn-track', planData);
            console.log('Inserted:', response.data);
            alert('Learning Plan Added Successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating:', error);
            if (error.response) {
                console.error('Backend Response:', error.response.data);
                setErrors(error.response.data);
            }
        }
    };

    return (
        <div className="addLearningPlan" style={{ backgroundImage: "url('/images/addbackground.jpg')" }}>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <p>Add Learning Plan</p>

                    {/* Title */}
                    <div className="row">
                        <div className="col-md-4 p-2">
                            <label className="form-label" style={{ marginRight: "20px" }}>Title</label> <BsPen />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
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
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                                placeholder="Topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
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
                                value={timelineStart}
                                onChange={(e) => setTimelineStart(e.target.value)}
                            />
                            {errors.timelineStart && <p className="error">{errors.timelineStart}</p>}
                        </div>

                        <div className="col-md-4 p-2">
                            <label className="form-label" style={{ marginRight: "20px" }}>Timeline End</label><BsCalendar3 />
                            <input
                                type="date"
                                className="form-control"
                                value={timelineEnd}
                                onChange={(e) => setTimelineEnd(e.target.value)}
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
                                            name="name"
                                            value={milestone.milestone}
                                            onChange={(e) => handleMilestoneChange(index, e)}
                                            placeholder="Enter milestone"
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
                                        <select name="status"style={{marginTop:'06px'}} value={milestone.status} onChange={(e) => handleMilestoneChange(index, e)} className="form-select">
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
                                value={resources}
                                onChange={(e) => setResources(e.target.value)}
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
    );
}

export default AddLearningPlan;
