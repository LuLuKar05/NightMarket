'use strict';
const __compactRuntime = require('@midnight-ntwrk/compact-runtime');
const expectedRuntimeVersionString = '0.9.0';
const expectedRuntimeVersion = expectedRuntimeVersionString.split('-')[0].split('.').map(Number);
const actualRuntimeVersion = __compactRuntime.versionString.split('-')[0].split('.').map(Number);
if (expectedRuntimeVersion[0] != actualRuntimeVersion[0]
     || (actualRuntimeVersion[0] == 0 && expectedRuntimeVersion[1] != actualRuntimeVersion[1])
     || expectedRuntimeVersion[1] > actualRuntimeVersion[1]
     || (expectedRuntimeVersion[1] == actualRuntimeVersion[1] && expectedRuntimeVersion[2] > actualRuntimeVersion[2]))
   throw new __compactRuntime.CompactError(`Version mismatch: compiled code expects ${expectedRuntimeVersionString}, runtime is ${__compactRuntime.versionString}`);
{ const MAX_FIELD = 52435875175126190479447740508185965837690552500527637822603658699938581184512n;
  if (__compactRuntime.MAX_FIELD !== MAX_FIELD)
     throw new __compactRuntime.CompactError(`compiler thinks maximum field value is ${MAX_FIELD}; run time thinks it is ${__compactRuntime.MAX_FIELD}`)
}

const _descriptor_0 = new __compactRuntime.CompactTypeOpaqueUint8Array();

const _descriptor_1 = new __compactRuntime.CompactTypeBoolean();

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_4 = new __compactRuntime.CompactTypeOpaqueString();

const _descriptor_5 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_6 = new __compactRuntime.CompactTypeEnum(2, 1);

const _descriptor_7 = new __compactRuntime.CompactTypeVector(10, _descriptor_4);

const _descriptor_8 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

class _ComplianceRules_0 {
  alignment() {
    return _descriptor_7.alignment().concat(_descriptor_8.alignment().concat(_descriptor_3.alignment().concat(_descriptor_1.alignment())));
  }
  fromValue(value_0) {
    return {
      allowed_jurisdictions: _descriptor_7.fromValue(value_0),
      min_kyc_level: _descriptor_8.fromValue(value_0),
      max_position_size: _descriptor_3.fromValue(value_0),
      requires_kyc: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_7.toValue(value_0.allowed_jurisdictions).concat(_descriptor_8.toValue(value_0.min_kyc_level).concat(_descriptor_3.toValue(value_0.max_position_size).concat(_descriptor_1.toValue(value_0.requires_kyc))));
  }
}

const _descriptor_9 = new _ComplianceRules_0();

class _Market_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_4.alignment().concat(_descriptor_4.alignment().concat(_descriptor_3.alignment().concat(_descriptor_3.alignment().concat(_descriptor_5.alignment().concat(_descriptor_1.alignment().concat(_descriptor_6.alignment().concat(_descriptor_3.alignment().concat(_descriptor_3.alignment().concat(_descriptor_3.alignment().concat(_descriptor_9.alignment())))))))))));
  }
  fromValue(value_0) {
    return {
      market_id: _descriptor_3.fromValue(value_0),
      question: _descriptor_4.fromValue(value_0),
      description: _descriptor_4.fromValue(value_0),
      end_time: _descriptor_3.fromValue(value_0),
      resolution_time: _descriptor_3.fromValue(value_0),
      market_creator: _descriptor_5.fromValue(value_0),
      is_resolved: _descriptor_1.fromValue(value_0),
      outcome: _descriptor_6.fromValue(value_0),
      total_liquidity: _descriptor_3.fromValue(value_0),
      yes_position_count: _descriptor_3.fromValue(value_0),
      no_position_count: _descriptor_3.fromValue(value_0),
      compliance_rules: _descriptor_9.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.market_id).concat(_descriptor_4.toValue(value_0.question).concat(_descriptor_4.toValue(value_0.description).concat(_descriptor_3.toValue(value_0.end_time).concat(_descriptor_3.toValue(value_0.resolution_time).concat(_descriptor_5.toValue(value_0.market_creator).concat(_descriptor_1.toValue(value_0.is_resolved).concat(_descriptor_6.toValue(value_0.outcome).concat(_descriptor_3.toValue(value_0.total_liquidity).concat(_descriptor_3.toValue(value_0.yes_position_count).concat(_descriptor_3.toValue(value_0.no_position_count).concat(_descriptor_9.toValue(value_0.compliance_rules))))))))))));
  }
}

const _descriptor_10 = new _Market_0();

class _Maybe_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_10.alignment());
  }
  fromValue(value_0) {
    return {
      is_some: _descriptor_1.fromValue(value_0),
      value: _descriptor_10.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.is_some).concat(_descriptor_10.toValue(value_0.value));
  }
}

const _descriptor_11 = new _Maybe_0();

class _ContractAddress_0 {
  alignment() {
    return _descriptor_5.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.bytes);
  }
}

const _descriptor_12 = new _ContractAddress_0();

const _descriptor_13 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.sender) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named sender');
    }
    if (typeof(witnesses_0.kyc_proof) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named kyc_proof');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      create_market: (...args_1) => {
        if (args_1.length !== 6) {
          throw new __compactRuntime.CompactError(`create_market: expected 6 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const question_0 = args_1[1];
        const description_0 = args_1[2];
        const end_time_0 = args_1[3];
        const resolution_time_0 = args_1[4];
        const compliance_rules_0 = args_1[5];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('create_market',
                                      'argument 1 (as invoked from Typescript)',
                                      'PredictionMarketFactory.compact line 36 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(typeof(end_time_0) === 'bigint' && end_time_0 >= 0n && end_time_0 <= 18446744073709551615n)) {
          __compactRuntime.type_error('create_market',
                                      'argument 3 (argument 4 as invoked from Typescript)',
                                      'PredictionMarketFactory.compact line 36 char 1',
                                      'Uint<0..18446744073709551615>',
                                      end_time_0)
        }
        if (!(typeof(resolution_time_0) === 'bigint' && resolution_time_0 >= 0n && resolution_time_0 <= 18446744073709551615n)) {
          __compactRuntime.type_error('create_market',
                                      'argument 4 (argument 5 as invoked from Typescript)',
                                      'PredictionMarketFactory.compact line 36 char 1',
                                      'Uint<0..18446744073709551615>',
                                      resolution_time_0)
        }
        if (!(typeof(compliance_rules_0) === 'object' && Array.isArray(compliance_rules_0.allowed_jurisdictions) && compliance_rules_0.allowed_jurisdictions.length === 10 && compliance_rules_0.allowed_jurisdictions.every((t) => true) && typeof(compliance_rules_0.min_kyc_level) === 'bigint' && compliance_rules_0.min_kyc_level >= 0n && compliance_rules_0.min_kyc_level <= 255n && typeof(compliance_rules_0.max_position_size) === 'bigint' && compliance_rules_0.max_position_size >= 0n && compliance_rules_0.max_position_size <= 18446744073709551615n && typeof(compliance_rules_0.requires_kyc) === 'boolean')) {
          __compactRuntime.type_error('create_market',
                                      'argument 5 (argument 6 as invoked from Typescript)',
                                      'PredictionMarketFactory.compact line 36 char 1',
                                      'struct ComplianceRules<allowed_jurisdictions: Vector<10, Opaque<"string">>, min_kyc_level: Uint<0..255>, max_position_size: Uint<0..18446744073709551615>, requires_kyc: Boolean>',
                                      compliance_rules_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_4.toValue(question_0).concat(_descriptor_4.toValue(description_0).concat(_descriptor_3.toValue(end_time_0).concat(_descriptor_3.toValue(resolution_time_0).concat(_descriptor_9.toValue(compliance_rules_0))))),
            alignment: _descriptor_4.alignment().concat(_descriptor_4.alignment().concat(_descriptor_3.alignment().concat(_descriptor_3.alignment().concat(_descriptor_9.alignment()))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._create_market_0(context,
                                               partialProofData,
                                               question_0,
                                               description_0,
                                               end_time_0,
                                               resolution_time_0,
                                               compliance_rules_0);
        partialProofData.output = { value: _descriptor_3.toValue(result_0), alignment: _descriptor_3.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      get_most_recent_market: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`get_most_recent_market: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('get_most_recent_market',
                                      'argument 1 (as invoked from Typescript)',
                                      'PredictionMarketFactory.compact line 64 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._get_most_recent_market_0(context,
                                                        partialProofData);
        partialProofData.output = { value: _descriptor_10.toValue(result_0), alignment: _descriptor_10.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      }
    };
    this.impureCircuits = {
      create_market: this.circuits.create_market,
      get_most_recent_market: this.circuits.get_most_recent_market
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = stateValue_0;
    state_0.setOperation('create_market', new __compactRuntime.ContractOperation());
    state_0.setOperation('get_most_recent_market', new __compactRuntime.ContractOperation());
    const context = {
      originalState: state_0,
      currentPrivateState: constructorContext_0.initialPrivateState,
      currentZswapLocalState: constructorContext_0.initialZswapLocalState,
      transactionContext: new __compactRuntime.QueryContext(state_0.data, __compactRuntime.dummyContractAddress())
    };
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                            alignment: _descriptor_8.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(1n),
                                                                            alignment: _descriptor_8.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newArray()
                                        .arrayPush(__compactRuntime.StateValue.newNull()).arrayPush(__compactRuntime.StateValue.newNull()).arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                                                                                                                           alignment: _descriptor_3.alignment() }))
                                        .encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(2n),
                                                                            alignment: _descriptor_8.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(new Uint8Array(32)),
                                                                            alignment: _descriptor_5.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    state_0.data = context.transactionContext.state;
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _sender_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.witnessContext(ledger(context.transactionContext.state), context.currentPrivateState, context.transactionContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.sender(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.type_error('sender',
                                  'return value',
                                  'PredictionMarketFactory.compact line 33 char 1',
                                  'Bytes<32>',
                                  result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_5.toValue(result_0),
      alignment: _descriptor_5.alignment()
    });
    return result_0;
  }
  _kyc_proof_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.witnessContext(ledger(context.transactionContext.state), context.currentPrivateState, context.transactionContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.kyc_proof(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _create_market_0(context,
                   partialProofData,
                   question_0,
                   description_0,
                   end_time_0,
                   resolution_time_0,
                   compliance_rules_0)
  {
    __compactRuntime.assert(this._verify_kyc_0(this._kyc_proof_0(context,
                                                                 partialProofData)),
                            'Invalid KYC proof');
    const tmp_0 = 1n;
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_8.toValue(0n),
                                                alignment: _descriptor_8.alignment() } }] } },
                     { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                            { value: _descriptor_2.toValue(tmp_0),
                                              alignment: _descriptor_2.alignment() }
                                              .value
                                          )) } },
                     { ins: { cached: true, n: 1 } }]);
    const market_id_0 = _descriptor_3.fromValue(Contract._query(context,
                                                                partialProofData,
                                                                [
                                                                 { dup: { n: 0 } },
                                                                 { idx: { cached: false,
                                                                          pushPath: false,
                                                                          path: [
                                                                                 { tag: 'value',
                                                                                   value: { value: _descriptor_8.toValue(0n),
                                                                                            alignment: _descriptor_8.alignment() } }] } },
                                                                 { popeq: { cached: true,
                                                                            result: undefined } }]).value);
    const new_market_0 = { market_id: market_id_0,
                           question: question_0,
                           description: description_0,
                           end_time: end_time_0,
                           resolution_time: resolution_time_0,
                           market_creator:
                             this._sender_0(context, partialProofData),
                           is_resolved: false,
                           outcome: 0,
                           total_liquidity: 0n,
                           yes_position_count: 0n,
                           no_position_count: 0n,
                           compliance_rules: compliance_rules_0 };
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_8.toValue(1n),
                                                alignment: _descriptor_8.alignment() } }] } },
                     { dup: { n: 0 } },
                     { idx: { cached: false,
                              pushPath: false,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_8.toValue(2n),
                                                alignment: _descriptor_8.alignment() } }] } },
                     { addi: { immediate: 1 } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newArray()
                                        .arrayPush(__compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(new_market_0),
                                                                                         alignment: _descriptor_10.alignment() })).arrayPush(__compactRuntime.StateValue.newNull()).arrayPush(__compactRuntime.StateValue.newNull())
                                        .encode() } },
                     { swap: { n: 0 } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(2n),
                                                                            alignment: _descriptor_8.alignment() }).encode() } },
                     { swap: { n: 0 } },
                     { ins: { cached: true, n: 1 } },
                     { swap: { n: 0 } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(1n),
                                                                            alignment: _descriptor_8.alignment() }).encode() } },
                     { swap: { n: 0 } },
                     { ins: { cached: true, n: 2 } }]);
    return market_id_0;
  }
  _get_most_recent_market_0(context, partialProofData) {
    const maybe_market_0 = _descriptor_11.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_8.toValue(1n),
                                                                                                alignment: _descriptor_8.alignment() } }] } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_8.toValue(0n),
                                                                                                alignment: _descriptor_8.alignment() } }] } },
                                                                     { dup: { n: 0 } },
                                                                     'type',
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(1n),
                                                                                                                            alignment: _descriptor_8.alignment() }).encode() } },
                                                                     'eq',
                                                                     { branch: { skip: 4 } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(1n),
                                                                                                                            alignment: _descriptor_8.alignment() }).encode() } },
                                                                     { swap: { n: 0 } },
                                                                     { concat: { cached: false,
                                                                                 n: (2+Number(__compactRuntime.maxAlignedSize(
                                                                                         _descriptor_10
                                                                                         .alignment()
                                                                                       ))) } },
                                                                     { jmp: { skip: 2 } },
                                                                     'pop',
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell(__compactRuntime.alignedConcat(
                                                                                                                            { value: _descriptor_8.toValue(0n),
                                                                                                                              alignment: _descriptor_8.alignment() },
                                                                                                                            { value: _descriptor_10.toValue({ market_id: 0n, question: '', description: '', end_time: 0n, resolution_time: 0n, market_creator: new Uint8Array(32), is_resolved: false, outcome: 0, total_liquidity: 0n, yes_position_count: 0n, no_position_count: 0n, compliance_rules: { allowed_jurisdictions: new Array(10).fill(''), min_kyc_level: 0n, max_position_size: 0n, requires_kyc: false } }),
                                                                                                                              alignment: _descriptor_10.alignment() }
                                                                                                                          )).encode() } },
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value);
    __compactRuntime.assert(maybe_market_0.is_some, 'No market found');
    return maybe_market_0.value;
  }
  _verify_kyc_0(proof_0) { return true; }
  static _query(context, partialProofData, prog) {
    var res;
    try {
      res = context.transactionContext.query(prog, __compactRuntime.CostModel.dummyCostModel());
    } catch (err) {
      throw new __compactRuntime.CompactError(err.toString());
    }
    context.transactionContext = res.context;
    var reads = res.events.filter((e) => e.tag === 'read');
    var i = 0;
    partialProofData.publicTranscript = partialProofData.publicTranscript.concat(prog.map((op) => {
      if(typeof(op) === 'object' && 'popeq' in op) {
        return { popeq: {
          ...op.popeq,
          result: reads[i++].content,
        } };
      } else {
        return op;
      }
    }));
    if(res.events.length == 1 && res.events[0].tag === 'read') {
      return res.events[0].content;
    } else {
      return res.events;
    }
  }
}
function ledger(state) {
  const context = {
    originalState: state,
    transactionContext: new __compactRuntime.QueryContext(state, __compactRuntime.dummyContractAddress())
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get market_count() {
      return _descriptor_3.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_8.toValue(0n),
                                                                                 alignment: _descriptor_8.alignment() } }] } },
                                                      { popeq: { cached: true,
                                                                 result: undefined } }]).value);
    },
    markets: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_8.toValue(1n),
                                                                                   alignment: _descriptor_8.alignment() } }] } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_8.toValue(1n),
                                                                                   alignment: _descriptor_8.alignment() } }] } },
                                                        'type',
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(1n),
                                                                                                               alignment: _descriptor_8.alignment() }).encode() } },
                                                        'eq',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      length(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`length: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_8.toValue(1n),
                                                                                   alignment: _descriptor_8.alignment() } }] } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_8.toValue(2n),
                                                                                   alignment: _descriptor_8.alignment() } }] } },
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      head(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`head: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_11.fromValue(Contract._query(context,
                                                        partialProofData,
                                                        [
                                                         { dup: { n: 0 } },
                                                         { idx: { cached: false,
                                                                  pushPath: false,
                                                                  path: [
                                                                         { tag: 'value',
                                                                           value: { value: _descriptor_8.toValue(1n),
                                                                                    alignment: _descriptor_8.alignment() } }] } },
                                                         { idx: { cached: false,
                                                                  pushPath: false,
                                                                  path: [
                                                                         { tag: 'value',
                                                                           value: { value: _descriptor_8.toValue(0n),
                                                                                    alignment: _descriptor_8.alignment() } }] } },
                                                         { dup: { n: 0 } },
                                                         'type',
                                                         { push: { storage: false,
                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(1n),
                                                                                                                alignment: _descriptor_8.alignment() }).encode() } },
                                                         'eq',
                                                         { branch: { skip: 4 } },
                                                         { push: { storage: false,
                                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(1n),
                                                                                                                alignment: _descriptor_8.alignment() }).encode() } },
                                                         { swap: { n: 0 } },
                                                         { concat: { cached: false,
                                                                     n: (2+Number(__compactRuntime.maxAlignedSize(
                                                                             _descriptor_10
                                                                             .alignment()
                                                                           ))) } },
                                                         { jmp: { skip: 2 } },
                                                         'pop',
                                                         { push: { storage: false,
                                                                   value: __compactRuntime.StateValue.newCell(__compactRuntime.alignedConcat(
                                                                                                                { value: _descriptor_8.toValue(0n),
                                                                                                                  alignment: _descriptor_8.alignment() },
                                                                                                                { value: _descriptor_10.toValue({ market_id: 0n, question: '', description: '', end_time: 0n, resolution_time: 0n, market_creator: new Uint8Array(32), is_resolved: false, outcome: 0, total_liquidity: 0n, yes_position_count: 0n, no_position_count: 0n, compliance_rules: { allowed_jurisdictions: new Array(10).fill(''), min_kyc_level: 0n, max_position_size: 0n, requires_kyc: false } }),
                                                                                                                  alignment: _descriptor_10.alignment() }
                                                                                                              )).encode() } },
                                                         { popeq: { cached: true,
                                                                    result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[1];
        return (() => {  var iter = { curr: self_0 };  iter.next = () => {    const arr = iter.curr.asArray();    const head = arr[0];    if(head.type() == "null") {      return { done: true };    } else {      iter.curr = arr[1];      return { value: _descriptor_10.fromValue(head.asCell().value), done: false };    }  };  return iter;})();
      }
    },
    get factory_owner() {
      return _descriptor_5.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_8.toValue(2n),
                                                                                 alignment: _descriptor_8.alignment() } }] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  originalState: new __compactRuntime.ContractState(),
  transactionContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  sender: (...args) => undefined, kyc_proof: (...args) => undefined
});
const pureCircuits = {};
const contractReferenceLocations = { tag: 'publicLedgerArray', indices: { } };
exports.Contract = Contract;
exports.ledger = ledger;
exports.pureCircuits = pureCircuits;
exports.contractReferenceLocations = contractReferenceLocations;
//# sourceMappingURL=index.cjs.map
