import React from "react";
import axios from "axios";

class HospitalManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hospitals: [],
            hospitalName: '',
            hospitalLocation: '',
            hospitalCapacity: '',
            statusMsg: ''
        };
    }

    componentDidMount() {
        axios.get("http://localhost:3001/hospitals")
            .then((res) => this.setState({ hospitals: res.data }))
            .catch((err) => console.log("Error fetching hospitals:", err));
    }

    handleChange = (e, keyword) => {
        if (keyword === "hospitalName") {
            this.setState({ hospitalName: e.target.value });
        } else if (keyword === "hospitalLocation") {
            this.setState({ hospitalLocation: e.target.value });
        } else {
            this.setState({ hospitalCapacity: e.target.value });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/hospitals", {
            name: this.state.hospitalName,
            location: this.state.hospitalLocation,
            capacity: this.state.hospitalCapacity
        }).then((res) => {
            this.setState({ hospitals: [...this.state.hospitals, res.data], statusMsg: 'Hospital added successfully!' });
        }).catch((err) => this.setState({ statusMsg: "Error adding hospital. Please try again." }));
    }

    onUpdate = (e, id) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/hospitals/${id}`, {
            name: this.state.hospitalName,
            location: this.state.hospitalLocation,
            capacity: this.state.hospitalCapacity
        }).then((res) => {
            const updatedHospitals = this.state.hospitals.map((hospital) => 
                hospital.id === id ? res.data : hospital
            );
            this.setState({ hospitals: updatedHospitals, statusMsg: 'Hospital updated successfully!' });
        }).catch((err) => this.setState({ statusMsg: "Error updating hospital. Please try again." }));
    }

    onDelete = (e, id) => {
        e.preventDefault();
        axios.delete(`http://localhost:3001/hospitals/${id}`)
            .then(() => {
                const remainingHospitals = this.state.hospitals.filter((hospital) => hospital.id !== id);
                this.setState({ hospitals: remainingHospitals, statusMsg: 'Hospital deleted successfully!' });
            })
            .catch((err) => this.setState({ statusMsg: "Error deleting hospital. Please try again." }));
    }

    render() {
        return (
            <>
                <form>
                    Hospital Name:
                    <input
                        type="text"
                        placeholder="Enter hospital name"
                        onChange={(e) => this.handleChange(e, "hospitalName")}
                    />
                    Hospital Location:
                    <input
                        type="text"
                        placeholder="Enter location"
                        onChange={(e) => this.handleChange(e, "hospitalLocation")}
                    />
                    Hospital Capacity:
                    <input
                        type="text"
                        placeholder="Enter capacity"
                        onChange={(e) => this.handleChange(e, "hospitalCapacity")}
                    />
                    <button onClick={(e) => this.handleSubmit(e)}>Add Hospital</button>
                </form>
                <p style={{ color: "red" }}>{this.state.statusMsg}</p>
                {this.state.hospitals.map((hospital) => (
                    <div key={hospital.id}>
                        <h2>Name: {hospital.name}</h2>
                        <p>Location: {hospital.location}</p>
                        <p>Capacity: {hospital.capacity}</p>
                        <button onClick={(e) => this.onDelete(e, hospital.id)}>Delete</button>
                        <button onClick={(e) => this.onUpdate(e, hospital.id)}>Update</button>
                        <hr />
                    </div>
                ))}
            </>
        );
    }
}

export default HospitalManager;
