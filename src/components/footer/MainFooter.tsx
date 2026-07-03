import { Link } from 'react-router-dom';
import { SERVICES } from '@/constants/services';

export function MainFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="text-lg font-semibold text-slate-900">ServiceHub</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            One place for house & car rentals, delivery, laundry, plumbing, air con,
            electronics, plants nursery, home cleaning, car wash, and dog spa services.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Services</p>
          <ul className="mt-3 space-y-2">
            {SERVICES.map((service) => (
              <li key={service.id}>
                <Link
                  to={service.path}
                  className="text-sm text-slate-600 no-underline hover:text-blue-600"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Company</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/about" className="text-sm text-slate-600 no-underline hover:text-blue-600">
                About us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-sm text-slate-600 no-underline hover:text-blue-600"
              >
                Contact us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">For providers</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Register with your role — delivery drivers get access to the route planner for
            optimized stops.
          </p>
          <Link
            to="/register"
            className="mt-3 inline-block text-sm font-medium text-blue-600 no-underline hover:underline"
          >
            Create an account →
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-4 text-center text-xs text-slate-500 sm:px-6">
        © {new Date().getFullYear()} ServiceHub · Make your way safe and easy
      </div>
    </footer>
  );
}
