const express = require('express');
const router = express.Router();
const { createHash } = require('crypto');

// Mock verification storage (in production, query from blockchain)
const verifications = new Map();
const auditDisclosures = new Map();

/**
 * GET /api/verification/:commitment
 * Check verification status by user commitment
 */
router.get('/:commitment', (req, res) => {
  try {
    const { commitment } = req.params;
    
    const status = verifications.get(commitment);
    
    if (!status) {
      return res.status(404).json({
        success: false,
        error: 'Verification not found',
        message: `No verification found for commitment: ${commitment}`
      });
    }
    
    // Return only public status (no private data)
    res.json({
      success: true,
      userCommitment: commitment,
      isVerified: status.isVerified,
      jurisdictionAllowed: status.jurisdictionAllowed,
      kycLevelMet: status.kycLevelMet,
      verifiedAt: status.verifiedAt,
      expiresAt: status.expiresAt,
      auditTrailHash: status.auditTrailHash,
      kycProvider: status.kycProvider
    });
  } catch (error) {
    console.error('Error fetching verification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch verification',
      message: error.message
    });
  }
});

/**
 * POST /api/verification/submit
 * Submit verification proof to the contract
 */
router.post('/submit', async (req, res) => {
  try {
    const { commitment, zkProof, kycProvider } = req.body;
    
    // Validation
    if (!commitment || !zkProof) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'commitment and zkProof are required'
      });
    }
    
    // In production:
    // 1. Verify ZK proof validity
    // 2. Call ZKUserVerification smart contract
    // 3. Wait for transaction confirmation
    // 4. Return on-chain verification status
    
    // For now, simulate successful verification
    const currentTime = Date.now();
    const validityPeriod = 90 * 24 * 60 * 60 * 1000; // 90 days
    
    const status = {
      userCommitment: commitment,
      isVerified: true,
      jurisdictionAllowed: true,
      kycLevelMet: true,
      verifiedAt: currentTime,
      expiresAt: currentTime + validityPeriod,
      auditTrailHash: createHash('sha256')
        .update(commitment + currentTime)
        .digest('hex')
        .slice(0, 16),
      kycProvider: kycProvider || 'unknown'
    };
    
    verifications.set(commitment, status);
    
    console.log(`✅ Verification submitted for commitment: ${commitment.slice(0, 10)}...`);
    console.log(`   Provider: ${kycProvider}`);
    console.log(`   Expires: ${new Date(status.expiresAt).toLocaleDateString()}`);
    
    res.json({
      success: true,
      message: 'Verification successful',
      status
    });
  } catch (error) {
    console.error('Verification submission failed:', error);
    res.status(500).json({
      success: false,
      error: 'Verification failed',
      message: error.message
    });
  }
});

/**
 * GET /api/verification/check/:commitment
 * Check if user is currently verified (bool result)
 */
router.get('/check/:commitment', (req, res) => {
  try {
    const { commitment } = req.params;
    const status = verifications.get(commitment);
    
    if (!status) {
      return res.json({
        success: true,
        isVerified: false,
        message: 'User not verified'
      });
    }
    
    const currentTime = Date.now();
    const isValid = status.isVerified && 
                    status.jurisdictionAllowed && 
                    status.kycLevelMet && 
                    currentTime < status.expiresAt;
    
    res.json({
      success: true,
      isVerified: isValid,
      expiresAt: status.expiresAt,
      daysRemaining: Math.floor((status.expiresAt - currentTime) / (1000 * 60 * 60 * 24))
    });
  } catch (error) {
    console.error('Error checking verification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check verification',
      message: error.message
    });
  }
});

/**
 * POST /api/verification/audit
 * Request audit disclosure (requires authorization)
 */
router.post('/audit', async (req, res) => {
  try {
    const { commitment, reason, auditorAuth } = req.body;
    
    // Validation
    if (!commitment || !reason || !auditorAuth) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'commitment, reason, and auditorAuth are required'
      });
    }
    
    // Verify auditor authorization (mock - real version checks credentials)
    const validAuditorTokens = [
      'AUTHORIZED_AUDITOR_TOKEN',
      'FCA_AUDITOR_2025',
      'SEC_REGULATOR_TOKEN'
    ];
    
    if (!validAuditorTokens.includes(auditorAuth)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid auditor credentials'
      });
    }
    
    // Check if user is verified
    const status = verifications.get(commitment);
    if (!status) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'No verification found for this commitment'
      });
    }
    
    // Create disclosure record
    const currentTime = Date.now();
    const disclosure = {
      userCommitment: commitment,
      disclosureReason: reason,
      disclosedAt: currentTime,
      authorizedBy: createHash('sha256').update(auditorAuth).digest('hex').slice(0, 16),
      disclosureHash: createHash('sha256')
        .update(commitment + reason + currentTime)
        .digest('hex')
        .slice(0, 16),
      auditId: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    };
    
    auditDisclosures.set(disclosure.auditId, disclosure);
    
    console.log(`⚠️  Audit disclosure requested`);
    console.log(`   Commitment: ${commitment.slice(0, 10)}...`);
    console.log(`   Reason: ${reason}`);
    console.log(`   Audit ID: ${disclosure.auditId}`);
    
    res.json({
      success: true,
      message: 'Audit disclosure authorized',
      disclosure,
      note: 'Sensitive data shared via secure off-chain channel'
    });
  } catch (error) {
    console.error('Audit disclosure failed:', error);
    res.status(500).json({
      success: false,
      error: 'Audit disclosure failed',
      message: error.message
    });
  }
});

/**
 * GET /api/verification/stats
 * Get verification statistics
 */
router.get('/stats/summary', (req, res) => {
  try {
    const currentTime = Date.now();
    const allVerifications = Array.from(verifications.values());
    
    const stats = {
      totalVerifications: allVerifications.length,
      activeVerifications: allVerifications.filter(v => 
        v.isVerified && currentTime < v.expiresAt
      ).length,
      expiredVerifications: allVerifications.filter(v => 
        currentTime >= v.expiresAt
      ).length,
      expiringSoon: allVerifications.filter(v => {
        const daysRemaining = (v.expiresAt - currentTime) / (1000 * 60 * 60 * 24);
        return daysRemaining > 0 && daysRemaining <= 7;
      }).length,
      providerBreakdown: {},
      totalAudits: auditDisclosures.size
    };
    
    // Provider breakdown
    allVerifications.forEach(v => {
      const provider = v.kycProvider || 'unknown';
      stats.providerBreakdown[provider] = (stats.providerBreakdown[provider] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

/**
 * DELETE /api/verification/:commitment
 * Revoke verification (user or issuer initiated)
 */
router.delete('/:commitment', async (req, res) => {
  try {
    const { commitment } = req.params;
    
    const status = verifications.get(commitment);
    if (!status) {
      return res.status(404).json({
        success: false,
        error: 'Verification not found',
        message: `No verification found for commitment: ${commitment}`
      });
    }
    
    // Update status to revoked
    const revokedStatus = {
      ...status,
      isVerified: false,
      jurisdictionAllowed: false,
      kycLevelMet: false,
      expiresAt: 0,
      revokedAt: Date.now()
    };
    
    verifications.set(commitment, revokedStatus);
    
    console.log(`❌ Verification revoked for commitment: ${commitment.slice(0, 10)}...`);
    
    res.json({
      success: true,
      message: 'Verification revoked',
      status: revokedStatus
    });
  } catch (error) {
    console.error('Error revoking verification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to revoke verification',
      message: error.message
    });
  }
});

module.exports = router;
