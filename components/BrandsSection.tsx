import Image from "next/image";

const brands = [
  {
    name: "EcoGrow",
    logo: "/placeholder.svg?height=60&width=120",
    description: "Organic fertilizers and soil amendments",
  },
  {
    name: "PlantPro",
    logo: "/placeholder.svg?height=60&width=120",
    description: "Professional gardening tools",
  },
  {
    name: "GreenLife",
    logo: "/placeholder.svg?height=60&width=120",
    description: "Sustainable plant containers",
  },
  {
    name: "NatureFirst",
    logo: "/placeholder.svg?height=60&width=120",
    description: "Natural pest control solutions",
  },
  {
    name: "BloomTech",
    logo: "/placeholder.svg?height=60&width=120",
    description: "Smart irrigation systems",
  },
  {
    name: "GardenMaster",
    logo: "/placeholder.svg?height=60&width=120",
    description: "Premium garden equipment",
  },
];

export default function BrandsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Trusted Brand Partners</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We partner with the world's leading gardening and plant care brands
            to bring you the highest quality products
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="group text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-gray-50 rounded-lg p-6 mb-3 group-hover:bg-gray-100 transition-colors">
                <Image
                  src={brand.logo || "/placeholder.svg"}
                  alt={brand.name}
                  width={120}
                  height={60}
                  className="mx-auto opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h3 className="font-semibold text-sm mb-1">{brand.name}</h3>
              <p className="text-xs text-gray-500">{brand.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Join over 10,000+ satisfied customers who trust our brand
            partnerships
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Quality Guaranteed
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Authorized Dealers
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Expert Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
