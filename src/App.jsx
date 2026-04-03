import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster, toast } from 'react-hot-toast';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import AdminPanel from "./components/AdminPanel";
import FloatingActions from "./components/FloatingActions";

// Pages
import Landing from "./pages/Landing";
import ProfilePage from "./pages/ProfilePage";
import TreatmentFlowPage from "./pages/TreatmentFlowPage";
import BookingPage from "./pages/BookingPage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";

// Dialog for notifications
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Existing notification logic setup
import { VAPID_PUBLIC_KEY, urlBase64ToUint8Array, subscribeUser } from './services/api';

function App() {
  const { pathname, hash } = useLocation();
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);


  const subscribeAndSync = async () => {
    try {
      console.log("Push System: Initiating registration flow...");
      const status = await Notification.requestPermission();
      if (status !== 'granted') {
        console.warn("Push System: Permission denied or ignored.");
        return;
      }

      console.log("Push System: Registering Service Worker...");
      await navigator.serviceWorker.register('/sw.js');
      const registration = await navigator.serviceWorker.ready;

      console.log("Push System: Fetching push sub from browser...");
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      };

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe(subscribeOptions);
      }
      
      const subscriptionJSON = subscription.toJSON();

      const savedUser = JSON.parse(localStorage.getItem('clinic_user'));
      const userId = savedUser?.id || `GUEST_${Date.now()}`;

      console.log(`Push System: Syncing with Backend (${userId})...`);
      const res = await subscribeUser(userId, subscriptionJSON);
      
      if (res.status === "success" || res.userId) {
        console.log("Push System: Successfully linked with backend.");
        toast.success('Notifications Enabled! 🔔 You will receive priority updates.', { theme: "colored" });
      } else {
        // Non-critical — push backend may not be configured yet
        console.warn("Push System: Backend sync skipped:", res);
      }
    } catch (err) {
      console.warn('Push System: Non-critical notification setup error:', err?.message || err);
    }
  };

  useEffect(() => {
    const handleInitialAsk = () => {
      if (!("Notification" in window) || !('serviceWorker' in navigator)) return;
      if (Notification.permission === "granted") {
        subscribeAndSync(); 
        return;
      }
      if (Notification.permission === "default") {
        setShowNotificationPrompt(true);
      }
    };

    // Listen for the custom event triggered after booking
    window.addEventListener('triggerPushPrompt', handleInitialAsk);
    
    // If they already granted permission in the past, silently sync to verify things are OK
    if ("Notification" in window && Notification.permission === "granted") {
      subscribeAndSync();
    }

    return () => window.removeEventListener('triggerPushPrompt', handleInitialAsk);
  }, []);

  const handleEnableNotifications = async () => {
    setIsSubscribing(true);
    await subscribeAndSync();
    setIsSubscribing(false);
    setShowNotificationPrompt(false);
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Automatically show our custom install prompt
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    // Hide our user interface that shows our A2HS button
    setShowInstallPrompt(false);
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary/20 selection:text-primary">
      <LoadingScreen />
      <Navbar />
      <FloatingActions />
      
      <Routes>
        <Route index element={<Landing />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="doctors" element={<BlogPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="treatment-flow/:serviceName" element={<TreatmentFlowPage />} />
        <Route path="book" element={<BookingPage />} />
        <Route path="appointment" element={<BookingPage />} />
        <Route path="*" element={<Landing />} />
      </Routes>

      <Footer />
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          className: 'font-bold text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-primary/20 shadow-2xl rounded-2xl p-4',
          duration: 4000,
        }}
      />

      {/* Modern Notification Permission Dialog */}
      <Dialog open={showNotificationPrompt} onOpenChange={setShowNotificationPrompt}>
        <DialogContent className="rounded-[2.5rem] p-6 sm:p-10 max-w-md border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-foreground mb-2">Enable Notifications? 🔔</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium leading-relaxed">
              {isSubscribing 
                ? "Please wait while we connect your device. Make sure to click 'Allow' if your browser asks!" 
                : "To get real-time status updates for your clinical sessions, please click Enable then Allow in the browser popup."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button disabled={isSubscribing} variant="outline" className="rounded-full h-12 flex-1 font-bold border-slate-200" onClick={() => setShowNotificationPrompt(false)}>
              Maybe Later
            </Button>
            <Button disabled={isSubscribing} className="rounded-full h-12 flex-1 font-bold bg-primary shadow-lg shadow-primary/20" onClick={handleEnableNotifications}>
              {isSubscribing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Activating...
                </>
              ) : (
                "Enable Notifications"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PWA Install Dialog */}
      <Dialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
        <DialogContent className="rounded-[2.5rem] p-6 sm:p-10 max-w-md border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-foreground mb-2">Install App 📱</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium leading-relaxed">
              Install our official application to your device for quick access, a native full-screen experience, and to receive real-time notifications about your treatment process!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button variant="outline" className="rounded-full h-12 flex-1 font-bold border-slate-200" onClick={() => setShowInstallPrompt(false)}>
              Maybe Later
            </Button>
            <Button className="rounded-full h-12 flex-1 font-bold bg-primary shadow-lg shadow-primary/20" onClick={handleInstallPWA}>
              Install App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
