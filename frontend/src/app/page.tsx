import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getSubjects() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${API_BASE_URL}/subjects`, { cache: 'no-store' });
    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (err) {
    console.error('Failed to fetch subjects:', err);
    return [];
  }
}

export default async function HomePage() {
  const subjects = await getSubjects();

  return (
    <div className="bg-animated-gradient min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Headline Area with animation/glassmorphism */}
        <div className="text-center mb-12 backdrop-blur-md bg-white/40 p-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 transform transition hover:scale-105 duration-500">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 via-indigo-700 to-pink-600 sm:text-6xl tracking-tight drop-shadow-sm mb-4">
            Welcome to Learning Management System
          </h1>
          <p className="text-lg text-gray-800 font-medium">
            Unlock your potential with our premium video tutorials and masterclasses.
          </p>
        </div>

        {/* Existing Courses section */}
        <h2 className="text-4xl justify-center text-center font-extrabold text-gray-900 tracking-tight sm:text-5xl border-b-[3px] pb-6 border-indigo-300/60 mb-8 inline-block w-full">
          Available Courses
        </h2>

        {subjects.length === 0 ? (
          <p className="mt-8 text-center text-gray-700 text-lg bg-white/50 backdrop-blur-sm p-6 rounded-2xl w-fit mx-auto border border-white/40 shadow-sm">
            No courses available at the moment.
          </p>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((course: any) => (
              <div key={course.id} className="bg-white/90 backdrop-blur-lg overflow-hidden shadow-xl rounded-2xl transition hover:-translate-y-2 hover:shadow-2xl duration-300 border border-white/60">
                <div className="relative h-48 w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
                  <span className="text-white text-2xl font-bold px-4 text-center z-10 drop-shadow-md">{course.title}</span>
                </div>
                <div className="p-6">
                  <h3 className="mt-2 text-xl font-bold text-gray-900 line-clamp-1">{course.title}</h3>
                  <p className="mt-3 text-base text-gray-600 line-clamp-2">{course.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                      {Number(course.price) === 0 ? 'Free' : `₹${Number(course.price).toFixed(0)}`}
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-gray-200/60 pt-5">
                    <Link href={`/subjects/${course.id}`} className="text-indigo-600 hover:text-pink-600 font-bold text-sm tracking-wide transition-colors">
                      View Details &rarr;
                    </Link>
                    <Link href={`/subjects/${course.id}`}>
                      <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5">
                        {Number(course.price) === 0 ? 'Enroll Now' : 'Buy Course'}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
