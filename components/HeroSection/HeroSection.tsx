import Image from "next/image";
import Link from "next/link";
import styles from "./HeroSection.module.css";
import {
  FiHeadphones,
  FiCheckCircle,
  FiTruck,
  FiShield,
  FiPackage,
} from "react-icons/fi";

const features = [
  {
    title: "دعم العملاء",
    description: "نحن هنا لخدمتك دائمًا",
    icon: FiHeadphones,
  },
  {
    title: "جودة مضمونة",
    description: "نختار الأفضل من أجلك",
    icon: FiCheckCircle,
  },
  {
    title: "شحن سريع وآمن",
    description: "توصيل لكل أنحاء مصر",
    icon: FiTruck,
  },
  {
    title: "منتجات أصلية %100",
    description: "مستوردة مباشرة من السعودية",
    icon: FiShield,
  },
  {
    title: "طلب مسبق بعربون",
    description: "ادفع عربون بسيط واحجز منتجك",
    icon: FiPackage,
  },
];

export default function HeroSection() {
  return (
    <section className="h-10/12 ">
      <div className=" ">
        <div className="flex flex-col md:flex-row items-center ">

          {/* Content - appears left on large screens, centered on small */}
          <div className="order-2 md:order-1 md:w-1/2 w-full py-2 px-4">
            <div className="text-center">
              <h1 className={`${styles.copyItem} text-2xl font-bold lg:text-6xl`}>منتجات سعودية أصلها الجودة</h1>
              <h3 className={`${styles.copyItem} text-xl font-semibold text-amber-400 my-1 lg:text-4xl lg:my-6`}>وتوصل لحد عندك</h3>
              <p className={`${styles.copyItem} text-gray-500 lg:text-2xl`}>من السعودية إلى مصر.. نختار الأفضل ونوصله لك</p>
            </div>

            <div className={`${styles.actions} flex justify-center gap-4 mt-4`}>
              <button className="bg-green-800 text-white rounded-3xl py-2 px-6">تسوق الآن</button>
              <Link href="/pre-order" className="border-2 border-amber-500 rounded-3xl py-2 px-6 transition hover:bg-amber-500 hover:text-white">اطلب طلب مسبق</Link>
            </div>

          
          </div>

          {/* Image - appears right on large screens, top on small screens */}
          <div className={`${styles.image} relative order-1 md:order-2 md:w-1/2 w-full lg:w-11/12 h-[40vh] lg:h-[70vh] overflow-hidden`}>
            <picture className="block w-full h-full">
              <source media="(max-width: 767px)" srcSet="/images/Hero Section Mobile.png" />
              <source media="(min-width: 768px)" srcSet="/images/Hero Section.png" />
              <Image src="/images/Hero Section.png" alt="Hero Section" fill sizes="(max-width: 767px) 100vw, 50vw" className="
  object-cover
  [mask-image:linear-gradient(to_left,transparent_0%,black_30%,black_100%)]
" />
            </picture>
          </div>

        </div>
          <div className="flex flex-wrap  md:mt-3 justify-center ">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`${styles.feature} w-1/2 md:w-1/6 border-slate-200 bg-slate-50 p-2 lg:p-4 text-slate-900 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:bg-white flex justify-between items-center rounded-3xl mb-2 md:mr-3`}
                  >
                    <div className={`${styles.featureIcon} mb-2 inline-flex h-8 w-8 items-center justify-center rounded-3xl bg-green-100 text-green-900 shadow-sm transition duration-300 group-hover:scale-105`}>
                      <Icon className="h-4 w-4 lg:h-10 lg:w-10" />
                    </div>
                    <div>
                      <h3 className="text-[11px] lg:text-[18px] text-right font-semibold text-slate-900 transition duration-300 group-hover:text-green-900">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-[10px] leading-4 lg:text-[15px] text-slate-600 transition duration-300 group-hover:text-slate-800">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
      </div>
    </section>
  );
}