'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, AlertCircle, Boxes, Check, Lock, LogIn, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Stocker le token
        localStorage.setItem('admin_token', data.data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.data.user));
        
        // Rediriger vers le dashboard
        router.push('/admin');
      } else {
        setError(data.error || 'Identifiants incorrects');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-intro">
        <div className="brand-mark"><Boxes size={25} strokeWidth={2.5} /></div>
        <p className="eyebrow">ShopFlow / Operations</p>
        <h1>Le stock, enfin lisible.</h1>
        <p className="intro-copy">
          Une vue claire de vos produits, de vos ventes et de vos équipes, réunie dans un seul espace de travail.
        </p>
        <div className="intro-points">
          <span><Check size={16} /> Inventaire en temps réel</span>
          <span><Check size={16} /> Alertes avant la rupture</span>
          <span><Check size={16} /> Rapports prêts à partager</span>
        </div>
        <div className="intro-footer">Plateforme de gestion pour équipes qui avancent.</div>
      </section>

      <section className="login-panel">
        <div className="login-heading">
          <p className="eyebrow">Espace sécurisé</p>
          <h2>Bon retour.</h2>
          <p>Connectez-vous pour retrouver votre activité.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <AlertCircle className="text-red-500" size={20} />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <div>
              <label className="field-label">
                Email
              </label>
              <div className="field-wrap">
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shopflow.com"
                  required
                  className="login-input"
                />
              </div>
            </div>

            <div>
              <label className="field-label">
                Mot de passe
              </label>
              <div className="field-wrap">
                <Lock size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="login-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="login-button"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Se connecter
                  <ArrowRight size={18} />
                </>
              )}
            </button>
        </form>
        <p className="login-note">Accès réservé aux membres autorisés de votre organisation.</p>
        <p className="login-copyright">ShopFlow © 2026</p>
      </section>
    </main>
  );
}