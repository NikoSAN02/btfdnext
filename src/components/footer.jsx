import { TwitterIcon, InstagramIcon, LinkedinIcon } from 'lucide-react'

export default function Footer() {
  return (
    <footer className=" text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 mr-2 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded"></div>
              <h2 className="text-xl font-bold">BTFD.WTF</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <TwitterIcon size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <InstagramIcon size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <LinkedinIcon size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Crypto®</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Download</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">NFTs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Rank</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Newsletter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Important links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Questions</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Legal</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}