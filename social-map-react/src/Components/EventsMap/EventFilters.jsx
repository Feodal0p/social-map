import Select from 'react-select'
import axios from '@plugin/axios'
import { useEffect, useState } from 'react'

export default function EventFilters({ selectedStatus, setSelectedStatus,
    selectedCategories, setSelectedCategories, selectedRadius, setSelectedRadius, myLocation,
    dateFrom, setDateFrom, dateTo, setDateTo }) {

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

    function handleResetFilters() {
        setSelectedStatus(['upcoming']),
        setSelectedCategories([]),
        setSelectedRadius(30),
        setDateFrom(null),
        setDateTo(null)
    }

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
            <label htmlFor="date-from">Date From</label>
            <input type="date" id='date-from'
                className='event-filters-input'
                value={dateFrom || ''}
                max={dateTo}
                onChange={(e) => setDateFrom(e.target.value)}
            />
            <label htmlFor="date-to">Date To</label>
            <input type="date" id='date-to'
                className='event-filters-input'
                value={dateTo || ''}
                min={dateFrom}
                onChange={(e) => setDateTo(e.target.value)}
            />
            <button className='reset-button' onClick={handleResetFilters}>Reset filters</button>
        </div>
    )
}
