import React, {useState} from 'react';
import {useSelector,useDispatch} from "react-redux";
import {FaPhoneAlt} from 'react-icons/fa';
import {ImLocation2} from 'react-icons/im';
import {sendContactPageMail} from '../../actions/adminActions'
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import Layout from "../../components/Layout/Layout";

import styled from './ContactScreen.module.css';

const ContactScreen = () => {
const [values, setValues] = useState({
	name:'',
	subject:'',
	message:'',
	email:''
});
 
const [errors, setErrors] = useState({});


const dispatch = useDispatch();

const contactMail = useSelector((state) => state.contactMail);
    const { loading, success,error, mail } = contactMail;


const handleChange = (e) => {
	const { name, value } = e.target;
	setValues({
		...values,
		[name]: value,
	});
};
 
const validate = ({values}) =>{
	let errors = {};

    // name
    if (!values.name.trim()) {
        errors.name = "name is cannot be empty";
    }
 
      // subject
    if (!values.subject) {
        errors.subject = "subject cannot be empty";
    }

    // email
    if (!values.email) {
        errors.email = "Please, provide email!";
    } else if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(values.email)) {
        errors.email = 'Email address is invalid';
    } 

    // message
    if (!values.message) {
        errors.message = "message cannot be empty";
    }

    return errors;
}

const submitHandler = (e) => {
		e.preventDefault();

		// set errors
		setErrors(validate({values}));

		// Dispatch register
		const mail = {
			name: values.name,
			subject: values.subject,
			message: values.message,
			email:values.email
		};

		if (
			mail.name &&
			mail.subject &&
			mail.message &&
			mail.email
		) {
			
			dispatch(sendContactPageMail({mail}));
			setValues({
				name:"",
				email:"",
				subject:"",
				message:""
			})
		} else {
			return;
		}
	};


	const mapUrl = `https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d126613.16292482342!2d3.8407726448898165!3d7.391792542609077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sveterinarian%20near%20Mokola%20Road%2C%20Ibadan!5e0!3m2!1sen!2sng!4v1629886921961!5m2!1sen!2sng" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"`
	return(
		<Layout>
			<div className={styled.mainContainer}>
		      <div className={styled.formWrapper}>
		          <div className={styled.formLeft}>
		              <h5>Help</h5>
		              <h1>Contact Us</h1>
		              <hr className ={styled.divider}/>
		              <p className={styled.text}>Feel free to call or leave us a message</p>
		              <div className={styled.call}>
		               <div className={styled.iconContainer}>
		                  <FaPhoneAlt className={styled.icons}/>
		               </div>
		               <p>(234) 70-8745-1228</p>
		              </div>
		              <div className={styled.location}>
		               <div className={styled.iconContainer}>
		                  <ImLocation2 className={styled.icons}/>
		               </div>
		             
		               <div className={styled.contactdetail}>
		               	   <p>9jaclinic Limited.</p>
			               <p>Sitibox® Privacy Officer </p>
			               <p>20 Speed Whitehouse, Mokola, Ibadan, Oyo State, Nigeria</p>
			               <p>admin@9jaclinic.com; tech@9jaclinic.com</p>
		              	</div>
		              </div>
		          </div>
		          <div className={styled.formRight}>
		            <form onSubmit={submitHandler}>
		                <div className={styled.formGroup}>
		                  <label htmlFor='Name'>Name</label>
		                  <input 
		                  	type='text' 
		                  	name='name' 
		                  	placeholder='Name'
		                  	value={values.name}
		                  	onChange={handleChange}
		                  	/>
		                  	{errors.name && <p>{errors.name}</p>}
		                </div>

		                <div className={styled.formGroup}>
		                  <label htmlFor='subject'>Email</label>
		                  <input 
		                  	type='email' 
		                  	name='email' 
		                  	placeholder='mail@example.com'
		                  	value={values.email}
		                  	onChange={handleChange}
		                  	/>
		                  	{errors.email && <p>{errors.email}</p>}
		                </div>

		                <div className={styled.formGroup}>
		                  <label htmlFor='subject'>Subject</label>
		                  <input 
		                  	type='text' 
		                  	name='subject' 
		                  	placeholder='Subject'
		                  	value={values.subject}
		                  	onChange={handleChange}
		                  	/>
		                  	{errors.subject && <p>{errors.subject}</p>}
		                </div>

		                <div className={styled.formGroup}>
		                  <label htmlFor='message'>Message</label>
		                  <textarea 
		                  	name='message' 
		                  	cols='50' 
		                  	value={values.message}
		                  	onChange={handleChange}
		                  	rows='10'></textarea>
		                  	{errors.message && <p>{errors.message}</p>}
		                </div>
		                {success && (
							<Message message="defaultMessage">
								{mail.msg}
							</Message>
						)}
						{loading && <Spinner />}
						{error && <Message message="dangerMessage">{error}</Message>}
		                <input type='submit' name='message' value='Submit' className={styled.actionBtn}/>
		            </form>
		          </div>
		      </div> 
		      <div>
		          <iframe src={mapUrl} className={styled.mapContainer} title='our location'></iframe>
		      </div>
		    </div>
		</Layout>
	)
}

export default ContactScreen;