import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Joi from 'joi';
import { useContext } from 'react';
import { UserContext } from '../userContext';

function Registration({ closeModal, isRegistrationModalOpen }) {
  const {username, setUsername, successMessage, setSuccessMessage} = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });

  const handleChange = (e) => {
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string().email({ tlds: { allow: false } }).required(),
      password: Joi.string().min(8).max(30).required(),
      confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .custom((value, helpers) => {
          if (value !== formData.password) {
            return helpers.message('"confirm password" must match "password"');
          }
          return value;
        })
        .required(),
    });
  
    const { error } = schema.validate(formData, { abortEarly: false });
  
    if (error) {
      const newErrors = {};
      error.details.forEach((detail) => {
        newErrors[detail.context.key] = detail.message;
      });
      
      setErrors(newErrors);
      return false;
    }
  
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3003/auth/register',
        formData,
        {
          withCredentials: true,
          responseType: 'json',
        },
      );

      // const user = response.data.user;
      console.log('Registration successful:', response.data);
      setSuccessMessage(true);
      setUsername(response.data.user.username);
      closeModal();
    } catch (error) {
      console.error('Registration error:', error.message);
      setErrors({
        ...errors,
        general: 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`max-w-2xl mx-auto ${isRegistrationModalOpen ? '' : 'hidden'}`}>
        <div
          className="fixed top-0 left-0 right-0 bottom-0 z-40 bg-gray-500 opacity-40"
          onClick={closeModal}
        ></div>
        <div className="absolute top-32 left-0 right-0 z-50 w-full max-w-2xl px-4 mx-auto">
          <div className="w-full flex flex-col justify-center rounded-lg shadow p-2 bg-[#1A183E]">
            <div className="flex flex-row justify-between align-center">
              <span>&nbsp;</span>
              <h1 className="text-2xl text-white text-center font-bold py-4">
                Sign Up
              </h1>
              <button
                onClick={closeModal}
                className="cursor-pointer text-white text-xl "
              >
                x
              </button>
            </div>
            <form className="w-full flex flex-col p-2" onSubmit={handleSubmit}>
              <div className="w-full mb-4 flex flex-col justify-center items-center">
                <label
                  htmlFor="username"
                  className="self-start px-16 text-gray-200 font-medium mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-4/5 text-black px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
                {errors.username && (
                  <div className="text-red-500">{errors.username}</div>
                )}
              </div>

              <div className="w-full mb-4 flex flex-col justify-center items-center">
                <label
                  htmlFor="email"
                  className="self-start px-16 text-white font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-4/5 text-black px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
                {errors.email && (
                  <div className="text-red-500">{errors.email}</div>
                )}
              </div>

              <div className="w-full mb-4 flex flex-col justify-center items-center">
                <label
                  htmlFor="password"
                  className="self-start px-16 text-white font-medium mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-4/5 text-black px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
                {errors.password && (
                  <div className="text-red-500">{errors.password}</div>
                )}
              </div>

              <div className="w-full mb-4 flex flex-col justify-center items-center">
                <label
                  htmlFor="confirmPassword"
                  className="self-start px-16 text-white font-medium mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-4/5 text-black px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
                {errors.confirmPassword && (
                  <div className="text-red-500">{errors.confirmPassword}</div>
                )}
              </div>

              <div className="w-full mb-4 flex flex-col justify-center items-center">
                <button
                  type="submit"
                  className="w-1/4 bg-[#00A83E] text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
                {errors.general && (
                  <div className="text-red-500">{errors.general}</div>
                )}
                {/* {errors.username && (
                  <div className="text-red-500">{errors.username}</div>
                )} */}
                {/* {errors.email && (
                  <div className="text-red-500">{errors.email}</div>
                )} */}
                {/* {errors.password && (
                  <div className="text-red-500">{errors.password}</div>
                )} */}
                {errors.confirmPassword && (
                  <div className="text-red-500">{errors.confirmPassword}</div>
                )}
                {successMessage && (
                  <div className="text-green-500">Welcome, {username}!</div>
                )}
              </div>
              <hr />
              <small className="text-white text-center pt-2">
                If you already have an account proceed with{' '}
                <span className="text-blue-400 cursor-pointer">login</span>
              </small>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

Registration.propTypes = {
  closeModal: PropTypes.func,
  isRegistrationModalOpen: PropTypes.bool,
};

export default Registration;
