export default function EventForm({ formData, setFormData, error, onSubmit}) {

    return (
        <form className='event-form-create' onSubmit={onSubmit}>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" placeholder="Event Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            {error && error.title && <div className="error">{error.title[0]}</div>}
            <label htmlFor="description">Description</label>
            <textarea rows='5' id="description" placeholder="Event Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
            <label htmlFor="date-start">Date & Time start</label>
            <input type="datetime-local" id="date-start"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} />
            {error && error.start_time && <div className="error">{error.start_time[0]}</div>}
            <label htmlFor="date-end">Date & Time end</label>
            <input type="datetime-local" id="date-end"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} />
            {error && error.end_time && <div className="error">{error.end_time[0]}</div>}
            <label htmlFor="location">Location</label>
            <textarea name='location' id="location" value={formData.location} readOnly />
            <button type="submit">Save Changes</button>
        </form>
    )
}