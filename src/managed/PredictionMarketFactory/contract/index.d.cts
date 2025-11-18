import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<T> = {
  sender(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
  kyc_proof(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
}

export type ImpureCircuits<T> = {
  create_market(context: __compactRuntime.CircuitContext<T>,
                question_0: string,
                description_0: string,
                end_time_0: bigint,
                resolution_time_0: bigint,
                compliance_rules_0: { allowed_jurisdictions: string[],
                                      min_kyc_level: bigint,
                                      max_position_size: bigint,
                                      requires_kyc: boolean
                                    }): __compactRuntime.CircuitResults<T, bigint>;
  get_most_recent_market(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, { market_id: bigint,
                                                                                                            question: string,
                                                                                                            description: string,
                                                                                                            end_time: bigint,
                                                                                                            resolution_time: bigint,
                                                                                                            market_creator: Uint8Array,
                                                                                                            is_resolved: boolean,
                                                                                                            outcome: number,
                                                                                                            total_liquidity: bigint,
                                                                                                            yes_position_count: bigint,
                                                                                                            no_position_count: bigint,
                                                                                                            compliance_rules: { allowed_jurisdictions: string[],
                                                                                                                                min_kyc_level: bigint,
                                                                                                                                max_position_size: bigint,
                                                                                                                                requires_kyc: boolean
                                                                                                                              }
                                                                                                          }>;
}

export type PureCircuits = {
}

export type Circuits<T> = {
  create_market(context: __compactRuntime.CircuitContext<T>,
                question_0: string,
                description_0: string,
                end_time_0: bigint,
                resolution_time_0: bigint,
                compliance_rules_0: { allowed_jurisdictions: string[],
                                      min_kyc_level: bigint,
                                      max_position_size: bigint,
                                      requires_kyc: boolean
                                    }): __compactRuntime.CircuitResults<T, bigint>;
  get_most_recent_market(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, { market_id: bigint,
                                                                                                            question: string,
                                                                                                            description: string,
                                                                                                            end_time: bigint,
                                                                                                            resolution_time: bigint,
                                                                                                            market_creator: Uint8Array,
                                                                                                            is_resolved: boolean,
                                                                                                            outcome: number,
                                                                                                            total_liquidity: bigint,
                                                                                                            yes_position_count: bigint,
                                                                                                            no_position_count: bigint,
                                                                                                            compliance_rules: { allowed_jurisdictions: string[],
                                                                                                                                min_kyc_level: bigint,
                                                                                                                                max_position_size: bigint,
                                                                                                                                requires_kyc: boolean
                                                                                                                              }
                                                                                                          }>;
}

export type Ledger = {
  readonly market_count: bigint;
  markets: {
    isEmpty(): boolean;
    length(): bigint;
    head(): { is_some: boolean,
              value: { market_id: bigint,
                       question: string,
                       description: string,
                       end_time: bigint,
                       resolution_time: bigint,
                       market_creator: Uint8Array,
                       is_resolved: boolean,
                       outcome: number,
                       total_liquidity: bigint,
                       yes_position_count: bigint,
                       no_position_count: bigint,
                       compliance_rules: { allowed_jurisdictions: string[],
                                           min_kyc_level: bigint,
                                           max_position_size: bigint,
                                           requires_kyc: boolean
                                         }
                     }
            };
    [Symbol.iterator](): Iterator<{ market_id: bigint,
  question: string,
  description: string,
  end_time: bigint,
  resolution_time: bigint,
  market_creator: Uint8Array,
  is_resolved: boolean,
  outcome: number,
  total_liquidity: bigint,
  yes_position_count: bigint,
  no_position_count: bigint,
  compliance_rules: { allowed_jurisdictions: string[],
                      min_kyc_level: bigint,
                      max_position_size: bigint,
                      requires_kyc: boolean
                    }
}>
  };
  readonly factory_owner: Uint8Array;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  impureCircuits: ImpureCircuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
