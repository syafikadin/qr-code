import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from './firebase';

function App() {
  const qrCollectionRef = collection(firestore, 'qrCode');
  const [qrValue, setQrValue] = useState('');
  const [qrStatus, setQrStatus] = useState('');
  const [registered, setRegistered] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [qrRegistered, setQrRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else if (countdown === 0 && qrRegistered) {
        // Jika countdown habis dan QR Code telah terdaftar, set status QR Code menjadi false
        setQrRegistered(false);
        updateQrStatus(inputCode, false); // Memperbarui status QR Code di Firestore
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, qrRegistered]);

  const handleSave = async (e) => {
    e.preventDefault();

    let data = {
      message: qrValue,
      status: qrStatus
    }

    try {
      await addDoc(qrCollectionRef, data);
      console.log('Data saved successfully to Firestore!');
      setRegistered(true);
      setQrRegistered(true);
      setQrStatus(true); // Set status QR Code ke true saat QR Code baru dibuat
      updateQrStatus(qrValue, true); // Memperbarui status QR Code di Firestore
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    }
  }

  const updateQrStatus = async (qrValue, status) => {
    const qrCodeQuery = query(qrCollectionRef, where("message", "==", qrValue));
    const querySnapshot = await getDocs(qrCodeQuery);
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, { status: status });
    });
  };

  const generateRandomValue = () => {
    const randomValue = Math.random().toString(36).substr(2, 8);
    setQrValue(randomValue);
    setRegistered(false);
    setCountdown(0); // Reset countdown saat menghasilkan QR Code baru
    setQrRegistered(false); // Reset status QR Code yang telah diregistrasi
  };

  const handleInputChange = (e) => {
    setInputCode(e.target.value);
  };

  const checkCodeValidity = async () => {
    const qrCodeQuery = query(qrCollectionRef, where("message", "==", inputCode));
    const querySnapshot = await getDocs(qrCodeQuery);

    if (querySnapshot.size > 0) {
      const docData = querySnapshot.docs[0].data();
      const status = docData.status;

      if (status) {
        setCountdown(10); // Mulai countdown jika status true
        setQrRegistered(true);
        updateQrStatus(inputCode, true); // Update status QR Code di Firestore
      } else {
        setErrorMessage('QR Code telah digunakan. Silahkan generate ulang QR Code')
        console.log('QR Code telah digunakan. Silahkan generate ulang QR Code');
      }
    }
  };



  return (
    <div className="App">
      <h1>Random QR Code Generator</h1>
      <button onClick={generateRandomValue}>Generate Random QR Code</button>
      {qrValue && (
        <div>
          <QRCode value={qrValue} />
          <p>Scan this QR Code with your mobile device</p>
          <form onSubmit={handleSave}>
            {!registered && (
              <button type="submit">Register QR Code</button>
            )}
          </form>
          {registered && (
            <div>
              <p>QR Code registered successfully!</p>
              <input
                type="text"
                placeholder="Enter QR Code"
                value={inputCode}
                onChange={handleInputChange}
              />
              <button onClick={checkCodeValidity}>Check Code</button>
              {countdown > 0 && <p>Countdown: {countdown} seconds</p>}
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;