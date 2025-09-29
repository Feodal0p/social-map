import Select from 'react-select'
import axios from '@plugin/axios'
import { useEffect, useState } from 'react'

export default function EventFilters({ selectedStatus, setSelectedStatus,
    selectedCategories, setSelectedCategories, selectedRadius, setSelectedRadius, myLocation }) {

    const [statuses, setStatuses] = useState([])
    const [categories, setCategories] = useState([])

    useEffect(() => {
        axios.get('/events/statuses').then(response => {
            setStatuses(response.data.statuses)
        })
        axios.get('/categories').then(response => {
            setCategories(response.data.categories.map(cat => ({ name: cat.name })))
        })
    }, [])
    return (
        <div className='event-filters'>
            <h1>Filters</h1>
            <label htmlFor="status-select">Status</label>
            <Select
                inputId='status-select'
                isMulti
                options={statuses.map(status => ({ value: status, label: status }))}
                value={selectedStatus.map(status => ({ value: status, label: status }))}
                onChange={(selectedOptions) => {
                    setSelectedStatus(selectedOptions.map(option => option.value))
                }}
                placeholder="Select statuses"
                isClearable={false}
                closeMenuOnSelect={false}
                className='react-select-container'
                classNamePrefix="react-select"
                styles={{
                    control: (base, state) => ({
                        ...base,
                        '&:hover': { borderColor: 'black' },
                        borderColor: state.isFocused ? 'black' : 'black',
                        boxShadow: state.isFocused ? 'black 0 0 0 1px' : 'none',
                    })
                }}
            />
            <label htmlFor="category-select">Categories</label>
            <Select
                inputId='category-select'
                isMulti
                options={categories.map(category => ({ value: category.name, label: category.name }))}
                value={selectedCategories.map(category => ({ value: category, label: category }))}
                onChange={(selectedOptions) => {
                    setSelectedCategories(selectedOptions.map(option => option.value))
                }}
                placeholder="Select categories"
                isClearable={false}
                closeMenuOnSelect={false}
                className='react-select-container'
                classNamePrefix="react-select"
                styles={{
                    control: (base, state) => ({
                        ...base,
                        '&:hover': { borderColor: 'black' },
                        borderColor: state.isFocused ? 'black' : 'black',
                        boxShadow: state.isFocused ? 'black 0 0 0 1px' : 'none',
                    })
                }}
            />
            {myLocation && (
                <>
                    <label htmlFor="radius-range">Radius (km)</label>
                    <div className="radius-filter">
                        <input type="range" id="radius-range" className='range-input'
                            min={0}
                            max={30}
                            step={1}
                            value={selectedRadius || 30}
                            onChange={(e) => setSelectedRadius(e.target.value)}
                        />
                        <span>{selectedRadius || 30} km</span>
                    </div>
                </>
            )}
        </div>
    )
}
