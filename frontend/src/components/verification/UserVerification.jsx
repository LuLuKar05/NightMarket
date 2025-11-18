import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, RefreshCw, Clock } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { submitVerification, checkVerification } from '../../services/api';
import './UserVerification.css';

/**
 * UserVerification Component
 * Allows users to verify their identity using external KYC proofs
 * without exposing personal data on-chain
 */
const UserVerification = ({ isConnected, onConnect }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [kycProvider, setKycProvider] = useState('');
  const [error, setError] = useState(null); // null = no error
  const [commitment, setCommitment] = useState(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Debug logging
  console.log('UserVerification render:', { status, error, initialCheckDone, isConnected });

  // Check existing verification on mount
  useEffect(() => {
    checkExistingVerification();
  }, []);

  const checkExistingVerification = async () => {
    try {
      // Check localStorage for existing commitment
      const savedCommitment = localStorage.getItem('userCommitment');
      
      if (savedCommitment) {
        setCommitment(savedCommitment);
        
        // Fetch status from backend
        const response = await checkVerification(savedCommitment);
        
        if (response.success) {
          // Check if verification is still valid (not expired)
          if (response.expiresAt && response.expiresAt > Date.now()) {
            setStatus(response);
            console.log('✅ Loaded existing verification from backend');
          } else {
            // Expired - clear it
            localStorage.removeItem('userCommitment');
            console.log('⚠️ Verification expired, cleared from storage');
          }
        }
      }
    } catch (err) {
      console.error('Error checking verification:', err);
      // If not found on backend, clear localStorage
      if (err.message && err.message.includes('not found')) {
        localStorage.removeItem('userCommitment');
      }
    } finally {
      setInitialCheckDone(true);
    }
  };

  const handleImportKYCProof = async (provider) => {
    setLoading(true);
    setKycProvider(provider);
    setError(null);

    try {
      // Step 1: Simulate importing KYC proof from provider
      console.log(`Importing KYC proof from ${provider}...`);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 2: Generate user commitment (public identifier)
      const userCommitment = generateMockCommitment();
      
      // Step 3: Generate ZK proof (simulated)
      const zkProof = 'zk_proof_' + Date.now() + '_' + provider;

      // Step 4: Submit to backend
      const response = await submitVerification({
        commitment: userCommitment,
        zkProof: zkProof,
        kycProvider: provider
      });

      if (response.success) {
        // Save commitment to localStorage
        setCommitment(userCommitment);
        localStorage.setItem('userCommitment', userCommitment);
        
        // Set status from backend response
        setStatus(response.status);
        setError(null);
        
        console.log('✅ Verification successful!', response.status);
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setError(error.message || 'Failed to verify. Please try again.');
    } finally {
      setLoading(false);
      setKycProvider('');
    }
  };

  const handleRenewVerification = async () => {
    if (!commitment) return;
    
    setLoading(true);
    setError(null);

    try {
      // Simulate renewal process
      console.log('Renewing verification...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate new ZK proof for renewal
      const zkProof = 'zk_proof_renewal_' + Date.now();

      // Submit renewal to backend (reusing same commitment)
      const response = await submitVerification({
        commitment: commitment,
        zkProof: zkProof,
        kycProvider: status?.kycProvider || 'civic'
      });

      if (response.success) {
        setStatus(response.status);
        setError(null);
        console.log('✅ Verification renewed successfully!');
      } else {
        throw new Error(response.message || 'Renewal failed');
      }
    } catch (error) {
      console.error('Renewal failed:', error);
      setError(error.message || 'Failed to renew. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockCommitment = () => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return '0x' + Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const getStatusBadge = () => {
    if (!status) return null;

    if (status.isVerified && status.jurisdictionAllowed && status.kycLevelMet) {
      return (
        <div className="status-badge verified">
          <CheckCircle size={16} />
          <span>Verified</span>
        </div>
      );
    }

    return (
      <div className="status-badge not-verified">
        <XCircle size={16} />
        <span>Not Verified</span>
      </div>
    );
  };

  const getDaysUntilExpiration = () => {
    if (!status || !status.expiresAt) return null;
    const now = Date.now();
    const daysRemaining = Math.floor((status.expiresAt - now) / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  const isExpiringSoon = () => {
    const days = getDaysUntilExpiration();
    return days !== null && days <= 7;
  };

  const handleReset = () => {
    // Clear local verification data
    // Note: Backend data persists (as it would on blockchain)
    localStorage.removeItem('userCommitment');
    setStatus(null);
    setCommitment(null);
    setError(null);
    console.log('🔄 Verification data reset (local only)');
  };

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="user-verification">
        <Card className="verification-card">
          <div className="connect-prompt">
            <Shield size={48} className="icon-shield-large" />
            <h2>Connect Your Wallet</h2>
            <p>Please connect your Midnight wallet to access identity verification features</p>
            <Button onClick={onConnect} className="connect-wallet-button">
              Connect Wallet
            </Button>
            <div className="connect-info">
              <AlertTriangle size={16} />
              <span>Zero-knowledge verification requires a connected wallet to generate cryptographic proofs</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="user-verification">
      <Card className="verification-card">
        <div className="card-header">
          <div className="header-title">
            <Shield size={24} className="icon-shield" />
            <div>
              <h2>Zero-Knowledge User Verification</h2>
              <p className="subtitle">
                Verify your identity using existing KYC credentials without exposing personal data
              </p>
            </div>
          </div>
        </div>

        <div className="card-content">
          {/* Only show info alert when no verification exists (not an error) */}
          {!status && !error && (
            <div className="alert alert-info">
              <AlertTriangle size={16} />
              <div>
                <strong>Privacy First:</strong> Your personal information stays private. Only your 
                compliance status is verified on-chain using zero-knowledge proofs.
              </div>
            </div>
          )}

          {/* Only show error alert when there's an actual error from verification attempt */}
          {error && (
            <div className="alert alert-error">
              <XCircle size={16} />
              <div>{error}</div>
            </div>
          )}

          {status && (
            <div className="verification-status">
              <div className="status-header">
                <span className="label">Verification Status</span>
                {getStatusBadge()}
              </div>

              <div className="status-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">Commitment</span>
                    <div className="detail-value commitment">
                      {commitment ? `${commitment.slice(0, 10)}...${commitment.slice(-8)}` : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">Verified At</span>
                    <div className="detail-value">
                      {status.verifiedAt ? new Date(status.verifiedAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Expires</span>
                    <div className="detail-value">
                      {status.expiresAt ? new Date(status.expiresAt).toLocaleDateString() : 'N/A'}
                      {isExpiringSoon() && (
                        <span className="expiring-warning">
                          <Clock size={14} />
                          {getDaysUntilExpiration()} days left
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="privacy-badges">
                <div className="badge-item success">✅ Jurisdiction verified (private)</div>
                <div className="badge-item success">✅ KYC level verified (private)</div>
                <div className="badge-item success">✅ Proof authenticity verified (private)</div>
                <div className="badge-item locked">🔒 Personal data never stored on-chain</div>
              </div>

              <div className="action-buttons">
                {isExpiringSoon() && (
                  <Button
                    onClick={handleRenewVerification}
                    disabled={loading}
                    className="btn-renew"
                  >
                    <RefreshCw size={16} />
                    {loading ? 'Renewing...' : 'Renew Verification'}
                  </Button>
                )}
                
                <Button
                  onClick={handleReset}
                  disabled={loading}
                  variant="outline"
                  className="btn-reset"
                >
                  Reset Verification
                </Button>
              </div>
            </div>
          )}

          {!status && (
            <div className="provider-selection">
              <p className="selection-title">Import your KYC proof from a supported provider:</p>

              <div className="provider-grid">
                <Button
                  onClick={() => handleImportKYCProof('civic')}
                  disabled={loading}
                  variant="outline"
                  className="provider-btn"
                >
                  {loading && kycProvider === 'civic' ? (
                    <>
                      <RefreshCw size={16} className="spinning" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <img src="/providers/civic.svg" alt="Civic" className="provider-logo" onError={(e) => e.target.style.display = 'none'} />
                      Civic Pass
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleImportKYCProof('fractal')}
                  disabled={loading}
                  variant="outline"
                  className="provider-btn"
                >
                  {loading && kycProvider === 'fractal' ? (
                    <>
                      <RefreshCw size={16} className="spinning" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <img src="/providers/fractal.svg" alt="Fractal" className="provider-logo" onError={(e) => e.target.style.display = 'none'} />
                      Fractal ID
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleImportKYCProof('synaps')}
                  disabled={loading}
                  variant="outline"
                  className="provider-btn"
                >
                  {loading && kycProvider === 'synaps' ? (
                    <>
                      <RefreshCw size={16} className="spinning" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <img src="/providers/synaps.svg" alt="Synaps" className="provider-logo" onError={(e) => e.target.style.display = 'none'} />
                      Synaps
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleImportKYCProof('veriff')}
                  disabled={loading}
                  variant="outline"
                  className="provider-btn"
                >
                  {loading && kycProvider === 'veriff' ? (
                    <>
                      <RefreshCw size={16} className="spinning" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <img src="/providers/veriff.svg" alt="Veriff" className="provider-logo" onError={(e) => e.target.style.display = 'none'} />
                      Veriff
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="how-it-works">
            <h3>How it works:</h3>
            <ol>
              <li>Import your existing KYC proof from a trusted provider</li>
              <li>Generate a zero-knowledge proof of compliance locally</li>
              <li>Submit only the proof to the smart contract</li>
              <li>Contract verifies compliance without seeing your data</li>
              <li>Receive verification status for market participation</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserVerification;
