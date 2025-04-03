'use client';

import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { gapi } from 'gapi-script'; //google api
import NavLogoAuthenticated from '../../components/NavLogo_Authenticated'; //for users once sign-ed in

//properties of calendar 
interface CalendarPass {
    id: string;
    summary: string;
    description?: string;
    start: {
      dateTime: string;
      timeZone: string;
    };
    end: {
      dateTime: string;
      timeZone: string;
    };
    htmlLink: string;
  }
  
  //if calendar fails, returns error desc
  interface CalendarError {
    error: {
      message: string;
      code: number;
    };
  }
  
  //success or failed
  type CalendarResponse = CalendarPass | CalendarError;

export default function CalendarPage() {
  const [isSignedIn, setIsSignedIn] = useState(false); //user sign-in set to false init

  //user fields for creating reminder
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
  });
  const [status, setStatus] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  //google api
  useEffect(() => {
    const initializeGapi = () => {
      gapi.client.init({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY, 
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar',
      }).then(() => {
        const auth = gapi.auth2.getAuthInstance();
        setIsSignedIn(auth.isSignedIn.get());//checks if user is signed-in
        auth.isSignedIn.listen(setIsSignedIn);//rechecks if signed-in changes
      });
    };

    gapi.load('client:auth2', initializeGapi);
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setStatus(''); 
      }, 9000); 
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  //google login function
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;//get token
      gapi.client.setToken({ access_token: accessToken });//set token
      setIsSignedIn(true);
    },
    onError: () => {
      setStatus('Logging in has failed');
    },
    scope: 'https://www.googleapis.com/auth/calendar',
  });

  //editing reminder
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  //adding reminder
  const addReminder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('');//clear old status messages 

    if (!isSignedIn) {
      setStatus('Must log in to make a reminder.');
      return;
    }

    const { title, description, startDateTime, endDateTime } = eventData;

    //fields can't be empty
    if (!title || !startDateTime || !endDateTime) {
      setStatus('Must enter value for field.');
      return;
    }

    //start/end time logic
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    if (end <= start) {
      setStatus('Start Time Must Be Before End Time');
      setShowToast(true)
      return;
    }

    const event = {
      summary: title,
      description: description,
      start: {
        dateTime: start.toISOString(),
        timeZone: 'America/Los_Angeles', 
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
    };

    //add reminder to google calendar
    try {
      const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      const response = await new Promise<CalendarResponse>((resolve, reject) => {
        request.execute((responseData: CalendarResponse) => {
          if (responseData && 'error' in responseData) {
            reject(new Error(responseData.error.message));
          } else {
            resolve(responseData);
          }
        });
      });
    
      //link to go to calendar
      if ('htmlLink' in response) {
        setStatus(`Reminder Added!`);
      } else {
        setStatus('Reminder Added.');
      }
      setShowToast(true)
      
      //clears input fields after submission
      setEventData({
        title: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
      });
    } catch (error: any) {
      console.error('Adding Reminder failed', error);
      setStatus(`Adding Reminder failed: ${error.message || 'Unknown Err'}`);
      setShowToast(true)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <NavLogoAuthenticated />

{/* Medication Reminder Navbar*/}
    <div
        className="relative bg-cover bg-center py-6 shadow-md"
        style={{
          backgroundImage: "url('/images/meds.jpeg')", 
          zIndex: 10,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-15"></div>

        <div className="relative max-w-[90rem] mx-auto px-4">
          <h1 className="text-5xl font-bold text-white text-center ">
            Medical Reminders
          </h1>
        </div>
    </div>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <div
          className="w-64 text-white p-4 overflow-y-auto h-screen"
          style={{ backgroundColor: '#E0DFDF' }}
        >
          <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
            Sidebar Title
          </h2>
          <p className="mb-4 text-center text-gray-600">
            This is a scrollable sidebar.
          </p>
        </div>

        {/* Calendar Reminder Form */}
        <div className="flex-grow p-6">
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Add Reminder to Calendar</h2>
            <p className="text-gray-800">if a medmemo dev want to test this, send me your gmail address</p>

            {!isSignedIn ? (
              <button
                onClick={() => login()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign in with Google
              </button>
            ) : (
              <form onSubmit={addReminder} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-gray-700 font-medium">
                  <b>Medication </b>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={eventData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Input Reminder Title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-gray-700 font-medium">
                  <b>Dosage</b>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Input Reminder Details"
                    rows={3}
                  />
                </div>
                <div>
                  <label htmlFor="startDateTime" className="block text-gray-700 font-medium">
                  <b>Start Date & Time </b>
                  </label>
                  <input
                    type="datetime-local"
                    id="startDateTime"
                    name="startDateTime"
                    value={eventData.startDateTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDateTime" className="block text-gray-700 font-medium">
                  <b>End Date & Time</b>
                  </label>
                  <input
                    type="datetime-local"
                    id="endDateTime"
                    name="endDateTime"
                    value={eventData.endDateTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
                >
                  Add to Calendar
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          id="toast-simple"
          className="fixed bottom-4 right-4 flex items-center min-w-[400px] max-w-[600px] min-h-[80px] px-10 py-6 text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800 text-xl"
          role="alert"
        >
          <div className="flex items-center justify-center gap-4 w-full">
          <svg
  xmlns="http://www.w3.org/2000/svg"
  width="33"
  height="33"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
  <path d="M16 3v4" />
  <path d="M8 3v4" />
  <path d="M4 11h16" />
  <path d="M7 14h.013" />
  <path d="M10.01 14h.005" />
  <path d="M13.01 14h.005" />
  <path d="M16.015 14h.005" />
  <path d="M13.015 17h.005" />
  <path d="M7.01 17h.005" />
  <path d="M10.01 17h.005" />
</svg>
            <div className="text-xl font-normal text-center">{status}</div>
          </div>
        </div>
      )}
    </div>
  );
}
