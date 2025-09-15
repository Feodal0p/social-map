import Select from 'react-select'
import axios from '@plugin/axios'
import { useEffect, useState } from 'react'

export default function EventFilters({ selectedStatus, setSelectedStatus, selectedCategories, setSelectedCategories }) {

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
        <>
            <h1>Filters</h1>
            <p>Status</p>
            <Select
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
            <p>Categories</p>
            <Select
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
        </>
    )
}
