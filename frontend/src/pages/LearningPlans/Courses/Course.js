import React from 'react'
import axios from 'axios'
function Course() {
  const course = {
    id: "course2",
    title: "Course 2",
    subtitle: "Full Stack Basics",
    duration: "110hrs",
    price: "PAID"
  };
  const handleStartCourse = async (courseId) => {
    try {
      await axios.post("http://localhsot:8089/api/track-course", {
        userId: 1,
        courseId: courseId,
        status: "started"
      });
      alert("Course started");

    } catch (err) {
      console.error("error checking course", err)
    }
  }

  return (

    <div className="course-container">
      <p>Courses based on your interest</p>
      <div className="row row-cols-1 row-cols-md-3 g-3">
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">{course.title}</h5>
            <h6 className="card-subtitle mb-2 text-body-secondary">{course.subtitle}</h6>
            <p className="card-text">{course.duration}</p>
            <p>{course.price}</p>
            <button onClick={() => handleStartCourse(course.id)}>Start</button>
          </div>
        </div>

      </div>
      <div class="card" style={{ width: "18rem" }}>
        <div class="card-body">
          <h5 class="card-title">course 2</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
          <p class="card-text">110hrs</p>
          <p>PAID</p>
          <button>Start</button>

        </div>
      </div>
    </div>

  )
}

export default Course
