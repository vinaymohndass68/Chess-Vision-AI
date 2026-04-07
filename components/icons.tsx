import React from 'react';

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
  </svg>
);

export const WhitePawnIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.5 11.63c-2.5 2.5-2.5 6.63 0 9.13s6.63 2.5 9.13 0c2.5-2.5 2.5-6.63 0-9.13s-6.63-2.5-9.13 0" fill="#fff" />
      <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1.5 2.5-3 2.5-1.5 0-3-2.5-3-2.5-1.5 3 3 10.5 3 10.5" fill="#fff" />
      <path d="M22.5 34.5s-1.5-2.5-1.5-2.5-3-1.5-3-5.5 1.5-5.5 1.5-5.5 1.5 1.5 1.5 1.5h3s1.5-1.5 1.5-1.5 1.5 1.5 1.5 5.5-3 5.5-3 5.5-1.5 2.5-1.5 2.5z" fill="#fff" />
      <path d="M12.5 38.5h20" stroke="#000" />
    </g>
  </svg>
);

export const BlackPawnIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.5 11.63c-2.5 2.5-2.5 6.63 0 9.13s6.63 2.5 9.13 0c2.5-2.5 2.5-6.63 0-9.13s-6.63-2.5-9.13 0" fill="#000" strokeLnecap="round" />
      <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1.5 2.5-3 2.5-1.5 0-3-2.5-3-2.5-1.5 3 3 10.5 3 10.5" fill="#000" />
      <path d="M22.5 34.5s-1.5-2.5-1.5-2.5-3-1.5-3-5.5 1.5-5.5 1.5-5.5 1.5 1.5 1.5 1.5h3s1.5-1.5 1.5-1.5 1.5 1.5 1.5 5.5-3 5.5-3 5.5-1.5 2.5-1.5 2.5z" fill="#000" />
      <path d="M12.5 38.5h20" stroke="#000" />
    </g>
  </svg>
);

export const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);