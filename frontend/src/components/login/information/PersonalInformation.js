import React from 'react'

// Form Validation
import * as yup from "yup"
import { Formik } from 'formik'

// Bootstrap
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

// Date validation
import { parse, compareAsc } from 'date-fns'

// Establish the validation schema
const schema = yup.object({
    name: yup.string().required("Firstname is required!").matches(/^[a-zA-Z]+$/g, { message: "Can only contain alphabetical characters" }).min(2, "Must be more than 2 characters!").max(15, "Must be less than 15 characters!"),
    surname: yup.string().required("Surname is required!").matches(/^[a-zA-Z]+$/g, { message: "Can only contain alphabetical characters" }).min(2, "Must be more than 2 characters!").max(20, "Must be less than 20 characters!"),
    gender: yup.string().required("Required!").notOneOf(["default"], "Required!"),
    birthday: yup.string().required("Date is required!").transform(validateDate),
    profession: yup.string().required("Profession is required!").matches(/^[a-zA-Z\s]+$/g, { message: "Can only contain alphabetical characters and spaces" }).min(2, "Must be more than 2 characters!").max(30, "Must be less than 30 characters!"),
    pref_curr: yup.string().required("Required!").notOneOf(["default"], "Required!")
})

function PersonalInformation(props) {

    let initial = {
        name: props.info.name || '',
        surname: props.info.surname || '',
        age: props.info.age || '',
        gender: props.info.gender || "default",
        birthday: props.info.birthday || '',
        profession: props.info.profession || '',
        pref_curr: props.info.pref_curr || "default"
    }

    function handleSubmit(event) {
        let res = event
        res.age = getAge(event.birthday)
        props.saveInfo({ personal: res })
        props.increment()
    }

    return (
        <div className="form-row">
            <section className="info">
                <label className="section-title">Personal Information</label>
                <label className="section-subtitle">Please enter your personal information.</label>
            </section>
            <Formik
                enableReinitialize
                validationSchema={schema}
                onSubmit={handleSubmit}
                initialValues={ initial }
            >
                {({
                    handleSubmit,
                    handleChange,
                    isSubmitting,
                    values,
                    touched,
                    errors
                }) => (
                        <Form noValidate className="form" onSubmit={handleSubmit}>
                            <Form.Group controlId="name">
                                <Form.Label className="form-label">Name</Form.Label>
                                <Form.Control
                                    className="input-field"
                                    type="text"
                                    value={values.name}
                                    placeholder="Enter Name"
                                    onChange={handleChange}
                                    isInvalid={touched.name && errors.name}
                                />
                                <Form.Control.Feedback type="invalid"> {errors.name} </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="surname">
                                <Form.Label className="form-label">Surname</Form.Label>
                                <Form.Control
                                    className="input-field"
                                    type="text"
                                    placeholder="Enter Surname"
                                    onChange={handleChange}
                                    value={values.surname}
                                    isInvalid={touched.surname && errors.surname}
                                />
                                <Form.Control.Feedback type="invalid"> {errors.surname}  </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="double-field">
                                <div>
                                    <Form.Label className="form-label">Preffered Currency</Form.Label>
                                    <Form.Control
                                        id="pref_curr"
                                        as="select"
                                        className="mr-sm-2"
                                        custom
                                        value={values.pref_curr}
                                        onChange={handleChange}
                                        isInvalid={touched.pref_curr && errors.pref_curr}
                                    >
                                        <option value="default">Choose</option>
                                        <option value="ALL">ALL</option>
                                        <option value="Dollar">$</option>
                                        <option value="Euro">€</option>
                                    </Form.Control>
                                </div>
                                <div>
                                    <Form.Label className="form-label">Gender</Form.Label>
                                    <Form.Control
                                        id="gender"
                                        as="select"
                                        className="mr-sm-2"
                                        custom
                                        value={values.gender}
                                        onChange={handleChange}
                                        isInvalid={touched.gender && errors.gender}
                                    >
                                        <option value="default">Choose</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </Form.Control>
                                </div>
                            </Form.Group>

                            <Form.Group controlId="birthday">
                                <Form.Label className="form-label">Birthday</Form.Label>
                                <Form.Control
                                    className="input-field"
                                    type="text"
                                    placeholder="Enter birthday"
                                    onChange={handleChange}
                                    value={values.birthday}
                                    isInvalid={touched.birthday && errors.birthday}
                                />
                                <Form.Control.Feedback type="invalid"> {errors.birthday} </Form.Control.Feedback>
                            </Form.Group>

                            
                            <Form.Group>
                                <Form.Label className="form-label">Profession</Form.Label>
                                <Form.Control
                                    id="profession"
                                    className="input-field"
                                    type="string"
                                    value={values.profession}
                                    placeholder="Enter Profession"
                                    onChange={handleChange}
                                    isInvalid={touched.profession && errors.profession}
                                />
                                <Form.Control.Feedback type="invalid"> {errors.profession} </Form.Control.Feedback> 
                            </Form.Group>

                            <Form.Row className="signup-buttons">
                                <Button variant="secondary" onClick={props.decrement}>
                                    Back
                                </Button>
                                {!isSubmitting ?
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Next
                                    </Button> 
                                    :
                                    <Button variant="primary" className="login-btn" disabled={isSubmitting}>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="spinner-signup" />
                                    </Button>
                                }
                            </Form.Row>
                        </Form>
                    )}
            </Formik>
        </div>
    )
}

function getAge(dateString) { 
    var today = new Date();
    var birthDate = parse(dateString, 'dd/MM/yyyy', new Date()) 
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age
}

function validateDate(value, originalValue) {
    let regex = new RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)

    // Test if the format is right
    let match = regex.test(originalValue)

    if(match) {
        // Check if the date is right
        let parsedDate = parse(originalValue, 'dd/MM/yyyy', new Date()) 

        // Check if the date is not greater than today's date
        let res = compareAsc(new Date(), parsedDate)

        if(parsedDate.toJSON !== null && res !== -1) {
            return originalValue
        }
        else
            return ''
    }
    else
        return ''
}

export default PersonalInformation