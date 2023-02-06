/*
  1. React Forms

  At OneText we use React for most of our front-end. We build a lot of simple forms, for example:

  a) Authenticating a user
  b) Letting a customer enter their credit card and link it to their phone number
  c) Letting a merchant update 3rd-party credentials in a dashboard

  Please implement a `<Form>`, `<Input>` and `<Button>` React component
  
  - If the form is in an invalid state, clicking the button should show the invalidity
  - If the form is in a valid state, clicking the button should call `handleFormSubmit`
  - While `handleFormSubmit` is running, the button should show a loading state (e.g. a loading spinner)
  - If a `Button` or `Input` is rendered outside of a `Form`, they should throw an error
  - No need to write any CSS (unless you really want to). Functionality is more important for this exercise

  Here is an example of how the components will be used:
*/

import { useState } from "react";
import { Button } from "./Button";
import { Form } from "./Form";
import { Input } from "./Input";

const sleep = async (ms: number) => new Promise((r) => setTimeout(r, ms));

export function MyForm() {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ isValid, setIsValid ] = useState(true)
  const [ isLoading, setIsLoading ] = useState(false)
  

  // Simple validation for password input
  const isValidPassword = (password: string) => {
    return password.length > 8
  }

  const handleFormSubmit = async (event: React.SyntheticEvent) : Promise<void> => {
    event.preventDefault()
    setIsValid(true)
    setIsLoading(true)
    
    // Simulate loading so it's visible
    await sleep(1000)
    
    if (!isValidPassword(password)) {
      setIsValid(false)
      setIsLoading(false)
      return new Promise(resolve => resolve())
    }


    return fetch('/api/login', {
      method: 'post',
      body: JSON.stringify({
        email,
        password
      })
    }).then(res => {
      if (res.ok) {
        setIsLoading(false)
        window.location.href = 'http://www.onetext.com/dashboard';
      }
      // Handle non 200 error codes here
      setIsLoading(false)
    }).catch(err => {
      console.log("handle network error")
      setIsLoading(false)
    }) 
  }

  return (
    <Form
      onSubmit={ handleFormSubmit }
    >
      <Input
        id='email'
        type='email'
        label='Email'
        value={ email }
        onValue={ setEmail }
        required
      />

      <Input
        id='password'
        type='password'
        label='Password'
        value={ password }
        onValue={ setPassword }
        required
      />

      { !isValid && <>
        Password must be longer than 8 characters
      </>}

      <Button 
        isLoading={ isLoading }
        text="Log in"
        loadingText="Loading..."
      />
    </Form>
  )
}