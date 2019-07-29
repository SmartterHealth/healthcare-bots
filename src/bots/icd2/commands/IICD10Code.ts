/**
 * Interface that defines an ICD10 code.
 */
export interface IICD10Code {
    /** The ICD10 code. */
    code: string;

    /** The description of the ICD10 code. */
    description: string;

    /** The chapter for the ICD10 code. */
    chapter: string;

    /** Flag that indicates whther or not the code is billable.*/
    hipaa: boolean;
}
/** Interface that defines the result of searching for ICD10 codes. */
export interface IICD10SearchResults {
    /** An array containing the ICD10 codes that matches the search criteria. */
    codes: IICD10Code[];
}
