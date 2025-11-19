export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
            Patient privacy is our priority.
          </p>
          <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                &copy; {currentYear} MediBill Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}