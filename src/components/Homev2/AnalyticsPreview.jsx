import React from "react";
import { motion } from "framer-motion";
import { Eye, TrendingUp, ShoppingBag, Send } from "lucide-react";

const AnalyticsPreview = () => {
  return (
    <section className="py-24 bg-slate-550 dark:bg-slate-950 px-4 rounded-[3rem] lg:rounded-[5rem] overflow-hidden relative border-t border-white/5 mx-2 lg:mx-8 my-10">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[180px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl w-fit mb-6 border border-blue-500/20">
            <TrendingUp size={24} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black dark:text-white leading-tight mb-8">
            Pilotez votre <span className="text-blue-400">Croissance</span> en
            temps réel.
          </h2>
          <p className="text-slate-500 text-lg mb-10 max-w-md">
            Ne vendez plus en aveugle. Suivez chaque vue, chaque commande et
            chaque clic pour comprendre ce que vos clients adorent vraiment.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-[2rem]">
              <h4 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">
                Visibilité
              </h4>
              <p className="text-3xl font-black dark:text-white">+1,200</p>
              <div className="mt-2 text-[10px] text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded-full w-fit">
                +12% cette semaine
              </div>
            </div>
            <div className="glass-card p-6 rounded-[2rem]">
              <h4 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">
                Commandes
              </h4>
              <p className="text-3xl font-black dark:text-white">+48</p>
              <div className="mt-2 text-[10px] text-blue-400 font-bold bg-blue-400/10 px-2 py-0.5 rounded-full w-fit">
                Directement sur WhatsApp
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Content - The Mini Dashboard UI */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative lg:h-[500px] flex items-center justify-center"
        >
          {/* Main Visual: Glassmorphism Dashboard UI */}
          <div className="glass-card w-full max-w-md  rounded-[2.5rem] p-8 relative overflow-hidden group">
            {/* Fake Chart Lines */}
            <div className="flex items-end gap-1.5 h-32 mb-8">
              {[40, 60, 30, 80, 50, 90, 70, 45, 85, 55].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="flex-1 bg-gradient-to-t from-blue-600/50 to-blue-400 rounded-t-sm"
                />
              ))}
            </div>

            {/* List entries */}
            <div className="space-y-4">
              {[
                {
                  name: "Sacs à main Luxe",
                  stats: "110 clics",
                  performance: "+75%",
                  color: "bg-blue-400",
                },
                {
                  name: "Montre Connectée",
                  stats: "85 clics",
                  performance: "+58%",
                  color: "bg-green-400",
                },
                {
                  name: "Chaussures Sport",
                  stats: "72 clics",
                  performance: "+90%",
                  color: "bg-purple-400",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5"
                >
                  <div
                    className={`w-8 h-8 rounded-full ${item.color}/20 flex items-center justify-center`}
                  >
                    <ShoppingBag
                      size={14}
                      className={item.color.replace("bg-", "text-")}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold dark:text-white">
                      {item.name}
                    </p>
                    <div className="h-1.5 w-full bg-white/5 rounded-full mt-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: item.performance.replace("%", "") + "%",
                        }}
                        className={`${item.color} h-full rounded-full`}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-500">
                    {item.stats}
                  </span>
                </div>
              ))}
            </div>

            {/* Floating Notification */}
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-2 right-[10px] bg-green-500 p-3 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-slate-900"
            >
              <Send size={14} className="text-white" />
              <p className="text-[10px] font-black text-white">
                Nouvelle Commande WhatsApp !
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnalyticsPreview;
