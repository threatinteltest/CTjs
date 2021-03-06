import * as asn1js from "asn1js";
import { getParametersValue } from "pvutils";
import { utils } from "./utils.js";
import TreeHeadDataV2 from "./TreeHeadDataV2.js";
import { BaseClassSigned } from "./BaseClass.js";
//**************************************************************************************
export default class SignedTreeHeadDataV2 extends BaseClassSigned
{
	//**********************************************************************************
	/**
	 * Constructor for SignedTreeHeadDataV2 class
	 * @param {Object} [parameters={}]
	 * @property {Object} [schema] asn1js parsed value
	 */
	constructor(parameters = {})
	{
		super(parameters);
		
		//region Internal properties of the object
		/**
		 * @type {String}
		 * @description logID
		 */
		this.logID = getParametersValue(parameters, "logID", SignedTreeHeadDataV2.constants("logID"));
		/**
		 * @type {TreeHeadDataV2}
		 * @description treeHead
		 */
		this.treeHead = getParametersValue(parameters, "treeHead", SignedTreeHeadDataV2.constants("treeHead"));
		/**
		 * @type {Object}
		 * @description signature
		 */
		this.signature = getParametersValue(parameters, "signature", SignedTreeHeadDataV2.constants("signature"));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return value for a constant by name
	 * @param {string} name String name for a constant
	 */
	static constants(name)
	{
		switch(name)
		{
			case "logID":
				return "";
			case "treeHead":
				return (new TreeHeadDataV2());
			case "signature":
				return {};
			default:
				throw new Error(`Invalid constant name for SignedTreeHeadDataV2 class: ${name}`);
		}
	}
	//**********************************************************************************
	/**
	 * Convert SeqStream data into current class
	 * @param {!SeqStream} stream
	 */
	fromStream(stream)
	{
		this.logID = utils.getOID(stream, "SignedTreeHeadDataV2");
		
		this.treeHead = new TreeHeadDataV2({ stream });
		
		//region Signature
		const signatureLength = stream.getUint16();
		const signatureData = (new Uint8Array(stream.getBlock(signatureLength))).buffer.slice(0);
		
		const asn1 = asn1js.fromBER(signatureData);
		if(asn1.offset === (-1))
			throw new Error("Object's stream was not correct for SignedCertificateTimestampDataV2");
		
		this.signature = asn1.result;
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to SeqStream data
	 * @param {!SeqStream} stream
	 * @returns {boolean} Result of the function
	 */
	toStream(stream)
	{
		utils.appendOID(this.logID, stream);
		
		this.treeHead.toStream(stream);
		
		stream.appendUint16(this.signature.byteLength);
		stream.appendView(new Uint8Array(this.signature));

		return true;
	}
	//**********************************************************************************
}
//**************************************************************************************
