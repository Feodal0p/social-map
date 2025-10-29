import { useEffect, useState } from "react"
import axios from "@plugin/axios"
import Select from 'react-select'


export default function EventForm({ formData, setFormData, error, onSubmit, mode, getShortAddress }) {

    const [categories, setCategories] = useState([])

    useEffect(() => {
        axios.get('/categories')
            .then(response => {
                setCategories(response.data.categories)
            })
    }, [])

    return (
        <form className='event-form-create' onSubmit={onSubmit}>
            <h1>
                {mode === 'create' ? 'Create Event' : 'Update Event'}
            </h1>
            {error && error.global && <div className="error">{error.global}</div>}
            {formData.preview_image && (
                typeof formData.preview_image === 'string'
                    ? <img src={formData.preview_image} alt="Event Preview" className='event-preview-image' />
                    : <img src={URL.createObjectURL(formData.preview_image)} alt="Event Preview" className='event-preview-image' />
            )}
            <label htmlFor="preview_image" className="event-form-preview_image">
                {formData.preview_image?.name ? formData.preview_image.name : "Виберіть зображення для прев'ю"}
            </label>
            <input type="file" name="preview_image" id="preview_image" style={{ display: 'none' }}
                onChange={(e) => setFormData({ ...formData, preview_image: e.target.files[0] })} />
            {error && error.preview_image && <div className="error">{error.preview_image[0]}</div>}
            <label htmlFor="title">Title</label>
            <input type="text" id="title" placeholder="Event Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            {error && error.title && <div className="error">{error.title[0]}</div>}
            <label htmlFor="description">Description</label>
            <textarea rows='5' id="description" placeholder="Event Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
            <label htmlFor="categories">Categories (max 2)</label>
            <Select
                isMulti
                options={categories.map(category => ({ value: category.id, label: category.name }))}
                value={formData.categories.map(category => ({ value: category.id, label: category.name }))}
                onChange={(selectedOptions) => {
                    if (selectedOptions.length <= 2) {
                        setFormData({ ...formData, categories: selectedOptions.map(option => ({ id: option.value, name: option.label })) })
                    }
                }}
                placeholder="Select categories"
                isClearable={false}
                closeMenuOnSelect={false}
                className='react-select-container'
                classNamePrefix="react-select"
                styles={{ control: (base, state) => ({ ...base,
                    '&:hover': { borderColor: 'black' },
                    borderColor: state.isFocused ? 'black' : 'black',
                    boxShadow: state.isFocused ? 'black 0 0 0 1px' : 'none',
                 }) }}
            />
            {error && error.categories && <div className="error">{error.categories[0]}</div>}
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
            <textarea name='location' id="location" value={getShortAddress(formData.location)} readOnly />
            <button type="submit">
                {mode === 'create' ? 'Create Event' : 'Update Event'}
            </button>
        </form>
    )
}
