import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { useState, useEffect } from 'react'
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';


const App = () => {
  const [newEvent, setNewEvent] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")

  const [eventsData, setEventsData] = useState();
  const [show, setShow] = useState(false);
  moment.locale("en-GB");
  const localizer = momentLocalizer(moment)


  useEffect(() => {
    axios.get("http://localhost:3000/events").then(res => {
      setEventsData(res.data)
    })
  }, [eventsData])

  const handleSave = () => {
    setShow(false)
    const item = newEvent
    const saveObject = {
      id: Date.now(), start, end, allDay: true, title: item
    }

    if (item)
      axios.post("http://localhost:3000/events", saveObject).then(res => {
        setNewEvent("")
      })
  }

  const handleSelect = ({ start, end }) => {
    setStart(start)
    setEnd(end)
    setShow(true)
  };

  return (
    <div>
      <Calendar
        views={["day", "agenda", "work_week", "month"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={eventsData}
        style={{ height: "100vh" }}
        onSelectEvent={(event) => alert(event.title)}
        onSelectSlot={handleSelect}
      />

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Events</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please write something"
                autoFocus
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
